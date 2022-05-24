<template>
  <div
    ref="scrollComponent"
    class="chat-widget">
    <template
      v-if="widgetType === 'mix-widget'">
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
        @sort-change="sortChange"
        @tip="tip"
        @load-children="loadChildren">
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
    
    <div
      class="chat-widget__container"
      v-if="widgetType === 'comment-only'">
      <reply-form
        custom-class="chat-widget__reply"
        :loading="loading"
        v-model="message"
        @reply="reply">
      </reply-form>
    
      <section-comment
        :data="summary.comments"
        :loading="loading"
        :widget-type="widgetType"
        @delete-comment="goDeleteComment"
        @dislike-comment="dislikeComment"
        @refresh-comments="refreshComments"
        @reply-comment="replyComment"
        @like-comment="likeComment"
        @report="goReport">
      </section-comment>
    </div>
    
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

const { public: { api, common, thirdParty }} = useRuntimeConfig()
import useStore from '~~/store';
import commonConfig from '../config'

import WalletConnectProvider from '@walletconnect/web3-provider'
import { providers, ethers } from "ethers";

import useWidgetConfig from '~~/compositions/widget-config'
import useConfetti from '~~/compositions/confetti'

const { $bus } = useNuxtApp()
const store = useStore()

const { config } = useWidgetConfig()
const { showConfetti } = useConfetti()

let loginType = 'login'

let currentTab = config.modules[0]


let summary = reactive({
  comments: [],
  likes: [],
  dislikes: [],
  tips: []
})

// console.log(WalletConnectClient)
// const connector = new WalletConnect({
//   bridge: "https://bridge.walletconnect.org", // Required
//   // qrcodeModal: QRCodeModal,
// });
// console.log(connector)
// const client = await WalletConnectClient.init({
//   projectId: thirdParty.WALLET_CONNECT_PROJECT_ID
// })


//  Create WalletConnect Provider
const provider = new WalletConnectProvider({
  infuraId: "dda2473ca43f4555926534d427abc648",
  // bridge: "https://bridge.walletconnect.org",
  qrcode: true
});
const web3Provider = new providers.Web3Provider(provider)

//  Enable session (triggers QR Code modal)
;(async () => {
  try {
    provider.on("accountsChanged", (accounts) => {
     console.log('accounts', accounts)
    });

    provider.on("chainChanged", (chainId) => {
      console.log(chainId);
    });

    // Subscribe to session disconnection
    provider.on("disconnect", (code, reason) => {
      console.log(code, reason);
    });

    // await provider.enable()
    } catch (e) {
      console.log(e)
    }
  })()


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
      window.addEventListener("scroll", handleScroll)
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
    window.removeEventListener('storage', handleStorageChange)
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
  } catch (e) {}
}

tryAutoLogin()

let message = ref('')

watch(message, (val) => {
  setDraft(TARGET_URI, message.value)
})

var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;

console.log('origin', window.location.ancestorOrigins[0])

const login = async () => {
  if (!window.ethereum) {
    ElMessage.error({
      message: 'Please install MetaMask first.'
    })
    return
  }

  if (loginType === 'login') {
    await doAccountLogin()
  } else if (loginType === 'tip') {
    await doTipLogin()
  }
}

const refreshProfile = async () => {
  await store.getScreenName(true)
  ElMessage.success({
    message: 'Refresh done!'
  })
}

// window.ethereum.request({ method: 'eth_requestAccounts' })

let checkTipInterval = null
const doTipLogin = async () => {

  const network = window.ethereum.networkVersion
  const tipNetwork = store.tip_network
  const tipNetworkId = store.currency[tipNetwork].id
  if (network !== tipNetworkId) {
    if (process.env.NODE_ENV === 'production') {
      ElMessage.error({
        message: `Please switch your network to ${tipNetwork} first.`
      })
      return
    }
  }
  // const id =
  let account
  let accounts
  let toAddress = '0x3c98b726Cd9e9F20BEcAFD05A9AfFeCD61617C0b'
  let value = '0.0001'

  try {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' })
    if (accounts.length) {
      account = accounts[0]
      $bus.emit('show-connect-loading')
      // do the transfer 
      ethereum
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
          chain: tipNetwork,
          tx_hash: txHash
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
            message: 'Thanks for your support!'
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
      }, 5000)
    })
    .catch((error) => {
      $bus.emit('hide-connect-loading')
      store.setStatus({
        onTransactionProcessing: false
      })
      ElMessage.error({
        message: error.message
      })
    });
    } else {
      console.log('no accounts found')
    }
  } catch (e) {
    console.log(e)
  }
}

const doAccountLogin = async () => {

  const network = window.ethereum.networkVersion
  if (!commonConfig.supportedNetworks[`EVM/${network}`]) {
    ElMessage.error({
      message: `Sorry. The network is not supported. Current supported networks are: ${Object.values(commonConfig.supportedNetworks).join(', ')}.`
    })
    return
  }

  let account
  let accounts = await ethereum.request({ method: 'eth_accounts' })
  let signature
  const message = 'I authorize'
  console.log('accounts', accounts)
  if (!accounts.length) {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  }
  console.log('accounts2', accounts)
  if (accounts.length) {
    account = accounts[0]
    signature = await ethereum.request({ method: 'personal_sign', params: [ message, account ] })
    console.log('signature', signature)

    try {
      const { data: rs } = await $fetch(commonConfig.api().CREATE_USER, {
        method: 'POST',
        body: {
          chain: `EVM/${window.ethereum.networkVersion}`,
          address: account,
          message,
          signature
        },
        headers: getCommonHeader()
      })
      console.log(rs)

      connectDialogVisible.value = false

      store.setLogined(true)
      store.setLoginInfo({
        chain: rs.chain,
        address: rs.address,
        token: rs.token,
        screen_name: rs.screen_name,
        avatar: rs.avatar
      })

      await store.updateBalance(account)

      ElMessage.success({
        message: 'Sign in successfully!'
      })

      await getSummary()

      setTimeout(async () => {
        await store.getScreenName()
      }, 10)

      setTimeout(async () => {
        await store.syncBalance()
      }, 20)
    } catch (e) {
      console.log(e)
    }
    
  }
}

const sortChange = async (val) => {
  orderBy = val
  page = 1
  await getList(page)
}

const connectWallet =  async () => {
  await login()
}

const goConnectWallet = async () => {
  loginType = 'login'
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
  console.log(data)
}

// dislike
const dislike = async (data) => {
  await doReact((data ? '-' : '') + 'dislike')
  console.log('dislike', data)
}

const dislikeComment = async (data) => {
  await doReact((data.has_disliked ? '-' : '') + 'dislike', data)
  console.log(data)
}

// tip
const tipDialogVisible = ref(false)

const tip = async () => {
  try {
    beforePost()
    loginType = 'tip'
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
const deleteDialogVisible = ref(false)
const goDeleteComment = (data) => {
  console.log(data)
  deleteDialogVisible.value = true
}
const deleteComment = () => {
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
    console.log('rs', rs)
    console.log('summary', summary)
    summary[subType + 's'] = rs.list
    console.log('counts', rs.target_summary)
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
const getList = async (page = 1, since, parentId) => {
  if (onFetch) {
    return
  } else {
    onFetch = true
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
      message: 'Thank you for your feedback!'
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
  } finally {
    store.setStatus({
      onSubmitingTargetComment: false
    })
  }
}


const doReact = async (subType, data) => {
   try {
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
  
  console.log('data', data)
  await doReply(data.message, null, data.data.id, null)
  $bus.emit('reset-reply-comment', data.data)
}

const refreshComments = () => {
  console.log('refresh-comments')
  getList(1, store.last_got_time)
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
  if (val === 'tip') {
    await getTips()
  }
  if (val === 'like') {
    await getReactions('like')
  }
  if (val === 'dislike') {
    await getReactions('like')
  }
  if (val === 'tip') {
    await getTips()
  }
}

init().then(() => {})
</script>

<script>
export default {
  data () {
    return {
      data: {
        name: 'hello.bit',
        bio: 'Hello world, hello world',
        avatar: '',
        comments_2: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          created_at: '2022-10-10 10:00',
          content: 'Hi, May I ask if you interested to sell your Bzuki to me? Someone scammed my pfp and I lost it, so happened that you are holding almost the same traits with mine..',
          replies: [{
            id: '11',
            name: 'chatchat.bit',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            created_at: '2022-10-10 10:00',
            content: 'hello',
            reply_to: 'hello.bit'
          }, {
            id: '12',
            name: 'chatchat.bit',
            avatar: '',
            created_at: '2022-10-10 10:00',
            content: 'Scammer! You scam my ETH without sending me NFT'
          }, {
            id: '13',
            name: 'chatchat.bit',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            created_at: '2022-10-10 10:00',
            content: 'hello'
          }, {
            id: '14',
            name: 'chatchat.bit',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            created_at: '2022-10-10 10:00',
            content: 'Hi, May I ask if you interested to sell your Bzuki to me? Someone scammed my pfp and I lost it, so happened that you are holding almost the same traits with mine..'
          }]
        }, {
          id: '2',
          avatar: '',
          name: 'hello.bit',
          created_at: '2022-10-10 10:00',
          content: 'Hi, May I ask if you interested to sell your Bzuki to me? Someone scammed my pfp and I lost it, so happened that you are holding almost the same traits with mine..',
          replies: []
        }],
        tips: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          created_at: '1 day ago'
        }],
        dislikes: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }, {
          id: '2',
          avatar: '',
          name: 'chatchat.bit',
          asset: '120k'
        }, {
          id: '3',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }],
        likes: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }, {
          id: '2',
          avatar: '',
          name: 'chatchat.bit',
          asset: '120k'
        }, {
          id: '3',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }]
      }
    }
  }
}
</script>

<style lang="scss">
.chat-widget {
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