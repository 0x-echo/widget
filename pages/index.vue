<template>
  <div
    ref="scrollComponent"
    class="chat-widget">
    <template
      v-if="widgetType === 'mix-widget' || widgetType === 'comment-only'">
      <template-tabs
        :config="config"
        :data="summary"
        :loading="loading"
        v-model="message"
        @delete-comment="goDeleteComment"
        @connect-wallet="goConnectWallet"
        @dislike="dislike"
        @dislike-comment="dislikeComment"
        @like="like"
        @like-comment="likeComment"
        @logout="logout"
        @on-change-tab="onChangeTab"
        @refresh-comments="refreshComments"
        @refresh-profile="refreshProfile"
        @reply="reply"
        @reply-comment="replyComment"
        @report="goReport"
        @view-arweave-info="viewArweaveInfo"
        @sort-change="sortChange"
        @tip="tip"
        @load-children="loadChildren"
        @load-more-comments="loadMoreComments">
      </template-tabs>

      <chat-footer
        v-if="!loading"
        @logout="logout">
      </chat-footer>
    </template>
    
    <section-toolbar
      v-if="widgetType === 'lite-only'"
      :config="config"
      :loading="loading"
      @connect-wallet="connectDialogVisible = true"
      @tip="tip"
      @dislike="dislike"
      @logout="logout"
      @like="like"
      @refresh-profile="refreshProfile">
    </section-toolbar>

    <template-list
      v-if="['like-only', 'dislike-only', 'tip-only'].includes(widgetType)"
      :data="summary"
      :loading="loading"
      :module="config.modules[0]"
      @dislike="dislike"
      @like="like"
      @logout="logout"
      @tip="tip">
    </template-list>
    
    <dialog-connect
      v-model="connectDialogVisible"
      @connect-wallet="connectWallet">
    </dialog-connect>
    
    <dialog-tip
      v-model="tipDialogVisible"
      @go-next="tipLogin">
    </dialog-tip>
    
    <dialog-report
      v-model="reportDialogVisible"
      @submit="report">
    </dialog-report>
    
    <dialog-delete
      v-model="deleteDialogVisible"
      @submit="deleteComment">
    </dialog-delete>
  </div>
</template>

<script setup>
import configParser from '../libs/config-parser'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'

import { parseContent } from '../libs/content-parser'
import { setColorTheme, getDraft, setDraft, setBodyClass, insertStyle } from '../libs/helper'

import useStore from '~~/store';
import commonConfig from '../config'

import { providers, ethers } from "ethers";

import useWidgetConfig from '~~/compositions/widget-config'
import useConfetti from '~~/compositions/confetti'

import useLoading from '~~/compositions/loading'

const { public: { api, common, thirdParty }} = useRuntimeConfig()

// import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'
const GetWalletConnectProvider = () => import('@walletconnect/web3-provider/dist/umd/index.min.js')

const { $bus } = useNuxtApp()
const store = useStore()

const { config } = useWidgetConfig(store)

if (!config.modules || !config.modules.length) {
  location.href = `/404?error=${encodeURIComponent('WRONG WIDGET CONFIGURATION')}`
}
store.setWidgetConfig(config)

const { showConfetti } = useConfetti()
const { showLoading } = useLoading()

let currentTab = config.modules[0]
store.setLayout({
  currentTab
})

const status = computed(() => store.status)

let summary = reactive({
  name: 'code.bit',
  bio: 'Hello world.',
  avatar: 'https://ipfs.io/ipfs/QmVD87KnmMEgmDtV254xo3171KNpvv6xidQqaZZ9bpbzFX',
  comments: [],
  likes: [],
  dislikes: [],
  tips: []
})


const viewArweaveInfo = () => {
  ElMessage.info({
    message: 'Syncing to Arweave will be activated after Beta phase.'
  })
}

let provider = null
let web3provider = null

// WalletConnect cannot reopen dialog, so recreate an instance each time dialog is closed.
const getProvicer = async () => {
  const { default: WalletConnectProvider } = await GetWalletConnectProvider()
  const provider = new WalletConnectProvider ({
    infuraId: "dda2473ca43f4555926534d427abc648",
    // bridge: "https://bridge.walletconnect.org",
    qrcode: true,
    rpc: {
      10: 'https://mainnet.optimism.io',
      137: 'https://matic-mainnet.chainstacklabs.com',
      80001: 'https://matic-mumbai.chainstacklabs.com'
    }
  });
  const web3provider =  new providers.Web3Provider(provider)

  return {
    provider,
    web3provider
  }
}

//  Enable session (triggers QR Code modal)
const setUpProvider = async () => {
  const rs = await getProvicer()
  provider = rs.provider
  web3provider = rs.web3provider

  try {
    provider.on("accountsChanged", async (accounts) => {
      if (store.wallet.loginType === 'tip') {
        return
      }
      const chain = await web3provider.getNetwork()
      const networkId = chain.chainId

      const message = commonConfig.wallet.auth_message.replace('TIMESTAMP', new Date().getTime())

      const account = accounts[0]
      $bus.emit('show-connect-loading', `Please sign the message.`)
      try {
        const signature = await provider.request({ method: 'personal_sign', params: [ message, account ] })
        $bus.emit('hide-connect-loading')
        await requestLogin(account, message, signature, networkId)
      } catch (e) {
        $bus.emit('hide-connect-loading')
        ElMessage.error({
          message: e.message
        })
      }
    })

    provider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      $bus.emit('hide-connect-loading')
    });

    provider.on("error", (error) => {
      console.log('error', error);
    });
  } catch (e) {
    console.log('walletconnect error', e)
  }
}


const CHECK_INTERVAL = 60 * 1000

let localUpdateCommentIds = []

// connect wallet / disconnect wallet
let connectDialogVisible = ref(false)

const getCommonHeader = () => {
  const token = store.token
  return {
    Authorization: `Bearer ${token}`
  }
}

const loadChildren = async (id, parentPost) => {
  parentPost.current_reply_page++
  await getList(parentPost.current_reply_page, null, id)
  parentPost.is_expanded = true
}

const beforePost = () => {
  if (!store.hasLogined) {
    connectDialogVisible.value = true
    throw new Error('PLEASE LOGIN FIRST')
  }

  if (process.env.NODE_ENV === 'production') {
    if (store.balance.toString() === '0x0') {
      ElMessage.error({
        message: 'Sorry. Please make sure your balance is greater than 0.'
      })
      throw new Error('BALANCE SHOULD NOT BE ZERO')
    }
  }
}

const loadMoreComments = async () => {
  if (!onFetch) {
    await getList(++page)
  }
}

let checkInterval = null

let onHandlingStorageChange = false
const handleStorageChange = () => {
  if (onHandlingStorageChange) {
    return
  }
  onHandlingStorageChange = true
  try {
    const loginInfo = localStorage.getItem('login_info')
    if (loginInfo) {
      tryAutoLogin()
    } else {
      logout(true)
    }
  } catch (e) {
    console.log(e)
  }
  onHandlingStorageChange = false
}

onMounted(async () => {

  window.addEventListener('storage', handleStorageChange)

  if (config.modules.includes('comment')) {
    const draft = getDraft(TARGET_URI)
    if (draft) {
      message.value = draft
    }

    checkInterval = setInterval(async () => {
      try {
        const { data } = await $fetch(commonConfig.api().CHECK_POST, {
          params: {
            target_uri: TARGET_URI,
            since: store.last_got_time,
            exclude_ids: localUpdateCommentIds.join(',')
          },
          headers: getCommonHeader()
        })
        store.setNewPost(data.count)
      } catch (e) {}
    }, CHECK_INTERVAL)

    if (config.modules.includes('comment')) {
      // window.addEventListener("scroll", handleScroll)
    }
  } else {
    await getSummary()
  }

  // window.ethereum.on('accountsChanged', async (accounts) => {
  //   console.log('account changed', accounts)
  //   await connectWallet()
  // })
})

const scrollComponent = ref(null)
const handleScroll = async (e) => {
  if (currentTab !== 'comment') {
    return
  }
  let element = scrollComponent.value;
  if (element.getBoundingClientRect().bottom <= window.innerHeight + 100) {
    if (page >= totalPage) {
      return
    }
    if (!onFetch) {
      await getList(++page)
    }
  }
};

onBeforeUnmount(() => {
  checkInterval && clearInterval(checkInterval)
  if (config.modules.includes('comment')) {
    // window.removeEventListener('storage', handleStorageChange)
  }
})

const TARGET_URI = config.target_uri || 'demo'

// internal data
let loading = ref(true)
let hasLoaded = ref(false)

let page = 1
let onFetch = false
let totalPage = 1
let limit = 20

const tryAutoLogin = () => {
  try {
    const info = localStorage.getItem('login_info')
    const _info = JSON.parse(info)
    if (_info && _info.chain) {
      store.setLogined(true)
      store.setLoginInfo({
        chain: _info.chain,
        address: _info.address,
        token: _info.token,
        screen_name: _info.screen_name,
        avatar: _info.avatar
      })
      setTimeout(async () => {
        await store.getScreenName()
        await store.updateBalance(_info.address)
      }, 100)

      setTimeout(async () => {
        await store.syncBalance()
      }, 200)
    }
  } catch (e) {
    console.log('get login_info:', e)
  }
}

tryAutoLogin()

let message = ref('')

watch(message, (val) => {
  setDraft(TARGET_URI, message.value)
})

const login = async () => {
  if (store.wallet.loginType === 'login') {
    await doAccountLogin()
  } else if (store.wallet.loginType === 'tip') {
    await doTipLogin()
  }
}

const refreshProfile = async () => {
  const message = ElMessage({
    customClass: 'el-message--no-icon',
    message: h('div', { class: 'chat-loader', style: 'width: 20px; height: 20px;border-color:#4E75F6;'}, ''),
    duration: 0
  })
  
  try {
    await store.getScreenName(true)
    ElMessage.success({
      message: 'Refreshing done!'
    })
  } finally {
    message.close()
  }
}

const sendTip = async ({ currentProvider, account, chainId }) => {
  let gotSuccess = false // may trigger more than once due to the slow network
  let toAddress = '0x3c98b726Cd9e9F20BEcAFD05A9AfFeCD61617C0b'
  let value = store.tip_amount / (store.currency[store.tip_network].usd)
  console.log('value', value)
  if (value <= 0) {
      ElMessage.error({
        message: 'Something is wrong. Please try again later.'
      })
    return
  }

  const valueSplit = value.toString().split('.')
  value = valueSplit[0] + '.' + valueSplit[1].slice(0, 18)

  if (ethers.utils.getAddress(toAddress) === ethers.utils.getAddress(account)) {
    ElMessage.error({
      message: 'Sorry. Cannot send to the same address.'
    })
    return
  }
  
  let loadingMessage = `Hold on. It may take up to few minutes.`
  if (store.wallet.loginApp === 'walletconnect') {
    loadingMessage = `Please confirm the transaction and wait a moment.`
  }
  $bus.emit('show-connect-loading', loadingMessage)
      // do the transfer 
      currentProvider
      .request({
        method: 'eth_sendTransaction',
        params: [
          {
            from: account,
            to: toAddress,
            value: ethers.utils.parseEther(value).toHexString()
            // gasPrice: '',
            // gas: '',
          }
      ],
    })
    .then(async (txHash) => {
      if (!gotSuccess) {
        gotSuccess = true
      } else {
        return
      }
      store.setStatus({
        onTransactionProcessing: true
      })
      const data = {
        type: 'tip',
        target_uri: TARGET_URI,
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4(),
        meta: {
          from_address: account,
          to_address: toAddress,
          usd_value: store.tip_amount,
          value,
          chain: chainId,
          tx_hash: txHash,
          currency: store.currency[store.tip_network].usd,
          network: store.currency[store.tip_network]
        }
      }
      await submitTip(data)

      checkTipInterval = setInterval(async () => {
        const rs = await ethereum.request({
          method: 'eth_getTransactionReceipt',
          params: [txHash]
        })

        if (rs && rs.status === '0x1') {
          $bus.emit('hide-connect-loading')
          clearInterval(checkTipInterval)
          checkTipInterval = null
          ElMessage.success({
            message: 'Thank you!'
          })
          store.setStatus({
            onTransactionProcessing: false
          })
          showConfetti()
          tipDialogVisible.value = false
          connectDialogVisible.value = false
          data.meta.status = 'success'
          await submitTip(data)
          await getTips()
        }
      }, commonConfig.wallet.transaction_check_interval)
    })
    .catch((error) => {
      $bus.emit('hide-connect-loading')
      store.setStatus({
        onTransactionProcessing: false
      })
      console.log('send tip error:', error)
      ElMessage.error({
        message: error.message
      })
      if (error.message.includes('unable to sign')) {
        provider && provider.disconnect()
      }
    });
}

let checkTipInterval = null
const doTipLogin = async () => {
  let currentProvider
  let tipNetworkId
  if (store.wallet.loginApp === 'metamask') {
    if (!window.ethereum) {
      ElMessage.error({
        message: 'Please install MetaMask first.'
      })
      return
    }
    currentProvider = window.ethereum
    const network = window.ethereum.networkVersion
    if (!network) {
      ElMessage.error({
        message: 'Seems MetaMask are swithing network. Wait a moment.'
      })
      return
    }
    const tipNetwork = store.tip_network
    tipNetworkId = store.currency[tipNetwork].id
    if (network.toString() !== tipNetworkId.toString()) {
      ElMessage.error({
        message: `Your are on the wrong network. Please switch to ${tipNetwork}`
      })
      return
    }
  } else if (store.wallet.loginApp === 'walletconnect') {

    const chain = await web3provider.getNetwork()
    const networkId = chain.chainId
    const tipNetworkId = store.currency[store.tip_network].id
    if (networkId.toString() !== tipNetworkId.toString()) {
      ElMessage.error({
        message: `Your are on the wrong network. Please switch to ${store.tip_network}`
      })
      return
    }

    currentProvider = provider
  }
  
  // const id =
  let account
  let accounts


  try {
    // force reselect
    if (store.wallet.loginApp === 'metamask') {
      const rs = await currentProvider.request({
        method: "wallet_requestPermissions",
        params: [
          {
            eth_accounts: {}
          }
        ]
      })
      accounts = await currentProvider.request({ method: 'eth_requestAccounts' })
    } else if (store.wallet.loginApp === 'walletconnect') {
      accounts = await ethereum.request({ method: 'eth_accounts' })
    }

    if (accounts.length) {
      account = accounts[0]
      await sendTip({ currentProvider, account, chain: tipNetworkId })
    } else {
      $bus.emit('hide-connect-loading')
      store.setStatus({
        onTransactionProcessing: false
      })
    }
  } catch (e) {
    ElMessage.error({
      message: e.message
    })
    console.log(e)
    $bus.emit('hide-connect-loading')
    store.setStatus({
      onTransactionProcessing: false
    })
  }
}

const requestLogin = async (account, message, signature, chainId) => {
  const loading = ElMessage({
    customClass: 'el-message--no-icon',
    message: h('div', { class: 'chat-loader', style: 'width: 20px; height: 20px;border-color:#4E75F6;'}, ''),
    duration: 0
  })
  try {
      const { data: rs } = await $fetch(commonConfig.api().CREATE_USER, {
        method: 'POST',
        body: {
          chain: `EVM/${chainId}`,
          address: account,
          message,
          signature
        },
        headers: getCommonHeader()
      })

      connectDialogVisible.value = false

      store.setLogined(true)
      store.setLoginInfo({
        chain: rs.chain,
        address: rs.address,
        token: rs.token,
        screen_name: rs.screen_name,
        avatar: rs.avatar,
        ens: rs.ens,
        dotbit: rs.dotbit
      })

      await store.updateBalance(account)

      loading.close()

      ElMessage.success({
        message: 'Sign in successfully!'
      })

      if (provider) {
        try {
          await provider.disconnect()
        } catch (e) {}
      }

      await getSummary()

      // should not be too fast, so user can see it happen.
      setTimeout(async () => {
        await afterLogin()
      }, 800)

      setTimeout(async () => {
        await store.getScreenName()
      }, 10)

      setTimeout(async () => {
        await store.syncBalance()
      }, 20)
    } catch (e) {
      console.log(e)
      loading.close()
    }
}

const doAccountLogin = async () => {
  if (store.wallet.loginApp === 'metamask') {
    if (!window.ethereum) {
      ElMessage.error({
        message: 'Please install MetaMask first.'
      })
      return
    }
  }
  const network = window.ethereum.networkVersion
  if (!network) {
    ElMessage.error({
      message: 'Seems MetaMask are swithing network. Wait a moment.'
    })
    return
  }
  
  if (!commonConfig.supportedNetworks[`EVM/${network}`]) {
    // if mumbai is supported
    if (network.toString() === '80001' && store.widgetConfig.support_mumbai) {
    } else {
      ElMessage.error({
        message: `Sorry. The network is not supported. Current supported networks are: ${Object.values(commonConfig.supportedNetworks).join(', ')}.`
      })
      return
    }
  }

  let account
  let accounts = await ethereum.request({ method: 'eth_accounts' })
  let signature
  const message = commonConfig.wallet.auth_message.replace('TIMESTAMP', new Date().getTime())

  if (!accounts.length) {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  }

if (accounts.length) {
    account = accounts[0]
    signature = await ethereum.request({ method: 'personal_sign', params: [ message, account ] })

    await requestLogin(account, message, signature, window.ethereum.networkVersion)
  }
}

const sortChange = async (val) => {
  orderBy = val
  page = 1
  const instance = showLoading()
  try {
    await getList(page)
  } finally {
    instance.close()
  }
}

let hasOpen = false
const connectWallet =  async (item) => {
   store.setWallet({
     loginApp: item.value
   })
  if (item.value === 'metamask') {
    await login()
  } else {
    await setUpProvider()
    try {
      await provider.enable()
    } catch (e) {
      await provider.disconnect()
    }

    if (store.wallet.loginType === 'tip') {
      await doTipLogin()
    }
  }
}

const goConnectWallet = async () => {
  store.setWallet({
    loginType: 'login'
  })
  connectDialogVisible.value = true
}


const logout = (silent = false) => {
  store.setLogined(false)
  store.setLoginInfo({
    chain: '',
    address: '',
    screen_name: '',
    avatar: '',
    balance: ''
  })
  store.setCounts({
    has_liked: false,
    has_disliked: false
  })
  localStorage.removeItem('login_info')
  if (!silent) {
    ElMessage.success({
      message: 'Logout successfully!'
    })
  } 
}

// report
let currentReportPost = null
const reportDialogVisible = ref(false)
const goReport = async (data) => {
  currentReportPost = data
  reportDialogVisible.value = true
}

const report = async (reason) => {
  await doReport(reason, null, currentReportPost.id, null)
  reportDialogVisible.value = false
}

// like
const like = async (data) => {
  const type = (data ? '-' : '') + 'like'
  const rs = await doReact(type)
  if (rs) {
    if (type === 'like' && widgetType.value === 'like-only') {
      ElMessage.success({
        message: 'Thank you!'
      })
      showConfetti()
    }
    await getReactions('like')
  }
}

const likeComment = async (data) => {
  await doReact((data.has_liked ? '-' : '') + 'like', data)
}

// dislike
const dislike = async (data) => {
  await doReact((data ? '-' : '') + 'dislike')
}

const dislikeComment = async (data) => {
  await doReact((data.has_disliked ? '-' : '') + 'dislike', data)
}

// tip
const tipDialogVisible = ref(false)

const tip = async () => {
  try {
    beforePost()
    store.setWallet({
      loginType: 'tip'
    })
    tipDialogVisible.value = true
    await store.getCurrency()    
  } catch (e) {
    console.log(e)
  }
}

const tipLogin = (data) => {
  connectDialogVisible.value = true
}

// delete comment 
let currentComment = null
const deleteDialogVisible = ref(false)
const goDeleteComment = (data) => {
  currentComment = data
  deleteDialogVisible.value = true
}
const deleteComment = (data) => {
}

const getSummary = async () => {
  const { data: counts } = await $fetch(commonConfig.api().GET_TARGET_SUMMARY, {
    params: {
      target_uri: TARGET_URI
    },
    headers: getCommonHeader()
  })
  store.setCounts(counts)
  loading.value = false
}

const getReactions = async (subType) => {
  const params = {
    target_uri: TARGET_URI,
    page: 1,
    sub_type: subType
  }

  try {
    const { data: rs }= await $fetch(commonConfig.api().GET_REACTIONS, {
      params,
      headers: getCommonHeader()
    })
    summary[subType + 's'] = rs.list
    store.setCounts(rs.target_summary)
  } catch (e) {
    console.log(e)
  }
}

const getTips = async () => {
  const params = {
    target_uri: TARGET_URI,
    unique: true
  }

  try {
    const { data: rs }= await $fetch(commonConfig.api().GET_TIPS, {
      params,
      headers: getCommonHeader()
    })
    summary['tips'] = rs.list
    store.setCounts(rs.target_summary)
  } catch (e) {
    console.log(e)
  }
}

let orderBy = 'newest'
const commentSize = 20
const getList = async (page = 1, since, parentId) => {
  if (onFetch) {
    return
  } else {
    onFetch = true
    if (!parentId && !since) {
      if (page > 1) {
        store.setData('comment', {
          isLoadingMore: true
        })
      }
    }
  }

  const params = {
    target_uri: TARGET_URI,
    since,
    page,
    order_by: orderBy
  }

  if (parentId) {
    params.parent_id = parentId
  }

  try {
    const { data: rs }= await $fetch(commonConfig.api().GET_POST, {
      params,
      headers: getCommonHeader()
    })
    
    if (!parentId) {
      if (since) {
        for (let i in rs.list) {
          comments = [...rs.list, ...summary.comments]
        }
      } else {
        if (page === 1) {
          comments = rs.list
        } else {
          comments = [...summary.comments, ...rs.list]
        }
      }

      // add stat to replies
      comments.forEach(one => {
        if (!one.current_reply_page) {
          one.current_reply_page = 0
          one.is_expanded = false
        }
      })

      summary.comments = comments
      summary.counts = rs.target_summary

      store.setCounts(rs.target_summary)
      if (page === 1) {
        totalPage = Math.ceil(rs.total / limit)
        store.setLastGotTime(new Date().getTime())
        store.setNewPost(0)
        localUpdateCommentIds = []
        store.setData('comment', {
          hasMore: rs.total > commentSize,
          isLoadingMore: false
        })
      } else {
        store.setData('comment', {
          hasMore: rs.total > ((page - 1) * commentSize + rs.list.length),
          isLoadingMore: false
        })
      }
    } else {
      summary.comments.forEach(one => {
        if (one.id === parentId) {
          if (page === 1) {
            one.replies = rs.list
          } else {
            one.replies = [...one.replies, ...rs.list]
          }
        }
      })
    }

    if (!hasLoaded.value) {
      hasLoaded.value = true
      loading.value = false
    }
  } catch (e) {
    if (e.response && e.response._data) {
      ElMessage.error({
        message: e.response._data.msg
      })
    } else {
      ElMessage.error({
        message: 'Indexer error.'
      })
    }
  }
  onFetch = false
}


const submitTip = async (data) => {
  try {
     const rs = await $fetch(commonConfig.api().TIP, {
      method: 'POST',
      body: data,
      headers: getCommonHeader()
    })
  } catch (e) {
    console.log(e)
    if (e.response && e.response._data) {
      ElMessage.error({
        message: e.response._data.msg
      })
    }
  }
}

const doReply = async (content, parentId, directParentId, successCallback, type = 'comment') => {
   try {
    beforePost()

    if (!parentId) {
      store.setStatus({
        onSubmitingTargetComment: true
      })
    }
    const rs = await $fetch(commonConfig.api().CREATE_POST, {
      method: 'POST',
      body: {
        type,
        target_uri: TARGET_URI,
        parent_id: parentId,
        direct_parent_id: directParentId,
        content: parseContent(content, false),
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4()
      },
      headers: getCommonHeader()
    })
    

    if (rs.data.is_first_comment) {
      ElMessage.success({
        message: 'Congrats on your fist comment!'
      })
      showConfetti()
    } else {
      ElMessage.success({
        message: 'Sent!'
      })
    }

    if (successCallback) {
      successCallback()
    }
    // getList()
    if (!directParentId) {
      localUpdateCommentIds.push(rs.data.post.id)
      summary.comments.unshift(rs.data.post)
    } else {
      summary.comments.find(one => one.id === rs.data.post.parent_id).replies.push(rs.data.post)
    }
  } catch (e) {
    console.log(e)
    if (e.response && e.response._data) {
      ElMessage.error({
        message: e.response._data.msg
      })
    }
  } finally {
    store.setStatus({
      onSubmitingTargetComment: false
    })
  }
}

const doReport = async (content, parentId, directParentId, successCallback) => {
   try {
    beforePost()
    const rs = await $fetch(commonConfig.api().CREATE_POST, {
      method: 'POST',
      body: {
        type: 'report',
        target_uri: TARGET_URI,
        parent_id: parentId,
        direct_parent_id: directParentId,
        content: parseContent(content, false),
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4()
      },
      headers: getCommonHeader()
    })
    ElMessage.success({
      message: 'Thank you!'
    })
    if (successCallback) {
      successCallback()
    }
  } catch (e) {
    console.log(e)
    if (e.response && e.response._data) {
      ElMessage.error({
        message: e.response._data.msg
      })
    }
  }
}

// comment is a action that should be more serious, so we are not going to support auto-submitting it.
const afterLogin = async () => {
  if (store.login.beforeAction) {
    // if already did, ignore
    if (!store.counts[`has_${store.login.beforeAction}d`]) {
      try {
        await doReact(store.login.beforeAction)
      } catch (e) {}
    }
    // reset to empty whether succeeded or not
    store.setData('login', {
      beforeAction: ''
    })
  }
}


const doReact = async (subType, data) => {
   try {
    if (!data) {
      store.setData('login', {
        beforeAction: subType
      })
    }
    beforePost()
    const rs = await $fetch(commonConfig.api().CREATE_POST, {
      method: 'POST',
      body: {
        type: 'reaction',
        sub_type: subType,
        target_uri: TARGET_URI,
        parent_id: data ? data.id : null,
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4()
      },
      headers: getCommonHeader()
    })

    // reaction to comment
    if (data && rs.data.parent_summary) {
      for (let i in rs.data.parent_summary) {
        data[i] = rs.data.parent_summary[i]
      }
    }

    if (!data && rs.data.target_summary) {
      store.setCounts(rs.data.target_summary)
    }
    // ElMessage.success({
    //   message: 'Done!'
    // })
    // getList()
    return true
  } catch (e) {
    console.log(e)
    if (e.response && e.response._data) {
      ElMessage.error({
        message: e.response._data.msg
      })
    }
    return false
  }
}

// comment
const reply = async () => {
  if (!message.value) {
    ElMessage.error({
      message: 'Please type something'
    }) 
    
    return
  }

  await doReply(message.value, null, null, function () {
    message.value = ''
    setDraft(TARGET_URI, '')
    store.setCounts({
      comment_counts: store.counts.comment_counts + 1
    })
  })
}

const replyComment = async (data) => {
  if (!data.message) {
    ElMessage.error({
      message: 'Please type something'
    }) 
    
    return
  }
  
  await doReply(data.message, null, data.data.id, null)
  $bus.emit('reset-reply-comment', data.data)
}

const refreshComments = () => {
  const loading = showLoading()
  try {
    getList(1, store.last_got_time)
  } finally {
    loading.close()
  }
}

const widgetType = computed(() => {
  const modules = config.modules
  let liteCount = 0
  modules.forEach(item => {
    if (item.endsWith('lite')) {
      liteCount++
    }
  })
  
  if (modules.length === liteCount) {
    return 'lite-only'
  } else {
    if (modules.length === 1) {
      return `${modules[0]}-only`
    } else {
      return 'mix-widget'
    }
  }
})

let comments = reactive([])

const init = async () => {
  const firstModule = config.modules[0]
  if (firstModule === 'comment') {
    await getList()
    if (config.modules.includes('like')) {
      await getReactions('like')
    }
    if (config.modules.includes('dislike')) {
      await getReactions('dislike')
    }
    if (config.modules.includes('tip')) {
      await getTips()
    }
  }
  if (firstModule === 'like') {
    await getReactions('like')
  }
  if (firstModule === 'dislike') {
    await getReactions('dislike')
  }
  if (firstModule === 'tip') {
    await getTips()
  }
}


const onChangeTab = async (val) => {
  currentTab = val
  store.setLayout({
    currentTab
  })
  if (val === 'tip') {
    await getTips()
  }
  if (val === 'like') {
    await getReactions('like')
  }
  if (val === 'dislike') {
    await getReactions('dislike')
  }
  if (val === 'tip') {
    await getTips()
  }
}

window.addEventListener('beforeunload', (event) => {
  provider && provider.disconnect()
})

init().then(() => {})
</script>

<script>
export default {
  data () {
    return {
    }
  }
}
</script>

<style lang="scss">
.chat-widget {
  display: flex;
  flex-direction: column;
  width: 100%;
  
  .has-v-padding & {
    padding-top: 30px;
    padding-bottom: 30px;
  }
  
  .has-h-padding & {
    padding-right: 30px;
    padding-left: 30px;
  }
  
  &__reply {
    margin-bottom: 30px;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .chat-widget {
    padding: 30px 20px !important;
  }
}

#confetti-canvas {
  pointer-events: none;
  display: none;
  position: fixed;
  width: 100%;
  height: 120%;
  left: 0;
  top: -20%;
  z-index: 9999;
}
</style>