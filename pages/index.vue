<template>
  <div
    ref="widget"
    class="chat-widget">
    <template
      v-if="widgetType === 'mix-widget' || widgetType === 'comment-only'">
      <template-tabs
        :config="config"
        :data="summary"
        :has-more-likes="hasMoreLikes"
        :is-loading-more-likes="isLoadingMoreLikes"
        :loading="loading"
        v-model="message"
        @delete-comment="goDeleteComment"
        @connect-wallet="goConnectWallet"
        @dislike="dislike"
        @dislike-comment="dislikeComment"
        @like="like"
        @ilike="like"
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
        @load-more-comments="loadMoreComments"
        @load-more-likes="loadMoreLikes">
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
      @tip-reconnect="tipLogin"
      @do-tip="doTipLogin">
    </dialog-tip>
    
    <dialog-report
      v-model="reportDialogVisible"
      @submit="report">
    </dialog-report>
    
    <dialog-confirm
      confirm-button-text="Delete"
      confirm-button-type="danger"
      icon="ri-close-circle-line"
      title="Delete Comment?"
      v-model="deleteDialogVisible"
      @submit="deleteComment">
      The action cannot be undone.
      <br>
      The post cannot be deleted after it goes on-chain in about 5 minutes.
    </dialog-confirm>
  </div>
</template>

<script setup>
import configParser from '../libs/config-parser'
import { v4 as uuidv4 } from 'uuid'
import base58 from 'bs58'

import { ElMessage } from 'element-plus'

import { parseContent } from '../libs/content-parser'
import { setColorTheme, getDraft, setDraft, setBodyClass, insertStyle } from '../libs/helper'

import useStore from '~~/store';
import commonConfig from '../config'

import { providers, ethers } from "ethers"

import useConfetti from '~~/compositions/confetti'
import useReceiver from '~~/compositions/receiver'
import useSign from '~~/compositions/sign'
import useWidgetConfig from '~~/compositions/widget-config'

// whether login on this page or not
let loginOnCurrentPage = false

const sign = useSign()
const receiver = useReceiver()

const { public: { api, common, thirdParty }} = useRuntimeConfig()

// import WalletConnectProvider from '@walletconnect/web3-provider/dist/umd/index.min.js'
const GetWalletConnectProvider = () => import('@walletconnect/web3-provider/dist/umd/index.min.js')

const { $bus, $showLoading } = useNuxtApp()
const store = useStore()

const { config } = useWidgetConfig(store)

if (!config.modules || !config.modules.length) {
  location.href = `/404?error=${encodeURIComponent('WRONG WIDGET CONFIGURATION')}`
}
store.setWidgetConfig(config)

const { showConfetti } = useConfetti()

let currentTab = config.modules[0]
store.setLayout({
  currentTab
})

const getAuthMessage = (chain, address) => {
  const signKeys = sign.generateKeyPair()
  return {
    message: commonConfig.wallet.auth_message
    .replace('ADDRESS', `${chain}/${address}`)
    .replace('TIMESTAMP', new Date().getTime())
    .replace('PUBLIC_KEY', signKeys.publicKey.replace(/^0x/, '')),
    signKeys
  }
}

const initWallet = async () => {
  try {
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) {
      store.setData('wallet', {
        connectedWallets: accounts
      })
    }
  } catch (e) {}
}

initWallet().then(() => {})

// setTimeout(async () => {
  
// }, 5000)

const status = computed(() => store.status)

let summary = reactive({
  name: '',
  bio: '',
  avatar: '',
  comments: [],
  likes: [],
  dislikes: [],
  tips: []
})

let hasMoreLikes = ref(false)
let isLoadingMoreLikes = ref(false)
let likePage = 1
let dislikePage = 1


const viewArweaveInfo = (data) => {
  if (!data.ar_id) {
    ElMessage.info({
      message: 'The data is not yet sent to Arweave.'
    })
  }
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
      store.setData('wallet', {
        connectedWallets: accounts
      })
      if (store.wallet.loginType === 'tip') {
        return
      }
      const chain = await web3provider.getNetwork()
      const networkId = chain.chainId
      const account = accounts[0]
      const { message, signKeys } = getAuthMessage('EVM', account)
      $bus.emit('show-connect-loading', `Please sign the message.`)
      try {
        const signature = await provider.request({ method: 'personal_sign', params: [ message, account ] })
        $bus.emit('hide-connect-loading')
        await requestLogin(account, message, signature, 'EVM', signKeys)
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

  // if (process.env.NODE_ENV === 'production') {
  //   if (store.balance.toString() === '0x0') {
  //     ElMessage.error({
  //       message: 'Sorry. Please make sure your balance is greater than 0.'
  //     })
  //     throw new Error('BALANCE SHOULD NOT BE ZERO')
  //   }
  // }
}

const loadMoreComments = async () => {
  if (!onFetch) {
    await getList(++page)
  }
}

const loadMoreLikes = async () => {
  console.log('load more likes')
  await getReactions('like')
}

let checkInterval = null

let onHandlingStorageChange = false
const handleStorageChange = () => {
  if (onHandlingStorageChange) {
    return
  }
  if (loginOnCurrentPage) {
    return
  }
  onHandlingStorageChange = true
  try {
    const loginInfo = localStorage.getItem('login_info')
    if (loginInfo) {
      tryAutoLogin()
    } else {
      // console.log('do logout')
      // logout(true)
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

  window.ethereum && window.ethereum.on('accountsChanged', async (accounts) => {
    console.log('account changed', accounts)
    store.setData('wallet', {
      connectedWallets: accounts
    })
  })
})

const widget = ref(null)
const handleScroll = async (e) => {
  if (currentTab !== 'comment') {
    return
  }
  let element = widget.value;
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
    // await doTipLogin()
  } else if (store.wallet.loginType === 'reselect') {
    console.log('重新选择钱包')
    await window.ethereum.request({
      method: "wallet_requestPermissions",
      params: [
        {
          eth_accounts: {}
        }
      ]
    })
    const accounts = await ethereum.request({ method: 'eth_accounts' })
    if (accounts.length) {
      store.setData('wallet', {
        tipWallet: accounts[0]
      })
    }
    connectDialogVisible.value = false
  }
}

const refreshProfile = async () => {
  const loadingMessage = $showLoading()
  
  try {
    await store.getScreenName(true)
    ElMessage.success({
      message: 'Refreshing done!'
    })
  } finally {
    loadingMessage.close()
  }
}

const sendTip = async ({ currentProvider, account, chainId }) => {
  let gotSuccess = false // may trigger more than once due to the slow network
  let toAddress = store.receiver.address
  if (!toAddress) {
    ElMessage.error({
      message: 'Fail to resolve receiver\'s address.'
    })
    return
  }
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
      // const rs = await currentProvider.request({
      //   method: "wallet_requestPermissions",
      //   params: [
      //     {
      //       eth_accounts: {}
      //     }
      //   ]
      // })
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

const requestLogin = async (account, message, signature, chain, signKeys, walletPublicKey) => {
  const loadingMessage = $showLoading()
  
  try {
      const { data: rs } = await $fetch(commonConfig.api().CREATE_USER, {
        method: 'POST',
        body: {
          chain,
          address: account,
          message,
          signature,
          public_key: signKeys.publicKey.replace(/^0x/, ''),
          wallet_public_key: walletPublicKey
        },
        headers: getCommonHeader()
      })

      connectDialogVisible.value = false

      sign.save(signKeys.privateKey)

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

      loadingMessage.close()

      ElMessage.success({
        message: 'Sign in successfully!'
      })

      loginOnCurrentPage = true

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
        await store.getScreenName(true)
      }, 10)

      setTimeout(async () => {
        await store.syncBalance()
      }, 20)
    } catch (e) {
      console.log(e)
      loadingMessage.close()
      if (e.response && e.response._data) {
        ElMessage.error({
          message: e.response._data.msg
        })
      } else {
        ElMessage.error({
          message: 'Unknown login error.'
        })
      }
    } finally {
      $bus.emit('hide-connect-loading')
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

  try {
    let account
    let accounts = []
    let signature

    try {
      const fullAccounts = await ethereum.request({
        method: 'wallet_requestPermissions',
        params: [{ eth_accounts: {} }]
      })
      accounts = fullAccounts[0].caveats[0].value
    } catch (e) {
      if (!accounts.length) {
        accounts = await ethereum.request({ method: 'eth_accounts' })
      }
    }

    const { message, signKeys } = getAuthMessage('EVM', accounts[0])
    $bus.emit('show-connect-loading', `Connecting...`)

    if (accounts.length) {
      account = accounts[0]
      signature = await ethereum.request({ method: 'personal_sign', params: [ message, account ] })
      try {
        await requestLogin(account, message, signature, 'EVM', signKeys)
      } catch (e) {}
    }
  } catch (e) {
    console.log('login error:', e)
  } finally {
    $bus.emit('hide-connect-loading')
  }
}

const sortChange = async (val) => {
  orderBy = val
  page = 1
  const loadingMessage = $showLoading()
  try {
    await getList(page)
  } finally {
    loadingMessage.close()
  }
}

const phantomSign = async (key) => {
  const { message, signKeys } = getAuthMessage('solana', key)
  const encodedMessage = new TextEncoder().encode(message);
  const signedMessage = await window.solana.signMessage(encodedMessage, 'utf-8')
  await requestLogin(key, message, base58.encode(signedMessage.signature), 'solana', signKeys)
}

const phantomLogin = async () => {
  const isPhantomInstalled = window.solana && window.solana.isPhantom
  if (!isPhantomInstalled) {
    ElMessage.error({
      message: 'Please install Phantom first.'
    })
    return
  }

  let key

  try {
    window.solana.on("connect", () => {
      console.log("connected!")
    })
    if (window.solana.isConnected) {
      console.log('solana is already connected')
      key = window.solana.publicKey.toString()
      await phantomSign(key)
      return
    }
    $bus.emit('show-connect-loading', `Connecting...`)
    const resp = await window.solana.connect()
    key = resp.publicKey.toString()
    // 26qv4GCcx98RihuK3c4T6ozB3J7L6VwCuFVc7Ta2A3Uo 
    await phantomSign(key)
  } catch (err) {
    console.log(err)
    ElMessage.error({
      message: err.message
    })
    // { code: 4001, message: 'User rejected the request.' }
  } finally {
    $bus.emit('hide-connect-loading')
  }
}

let hasOpen = false
const connectWallet =  async (item) => {
   store.setWallet({
     loginApp: item.value
   })
  if (item.value === 'metamask') {
    await login()
  } else if (item.value === 'walletconnect') {
    await setUpProvider()
    try {
      await provider.enable()
    } catch (e) {
      console.log('walletconnect enable error', e)
      await provider.disconnect()
    }

    // if (store.wallet.loginType === 'tip') {
    //   await doTipLogin()
    // }
  } else if (item.value === 'phantom') {
    await phantomLogin()
  } else if (item.value === 'arconnect') {
    await arconnectLogin()
  } else {
    ElMessage.error(`Unsupported login method: ${item.name}`)
  }
}

const goConnectWallet = async () => {
  store.setWallet({
    loginType: 'login'
  })
  connectDialogVisible.value = true
}

const arconnectLogin = async () => {
  if (!window.arweaveWallet) {
    ElMessage.error('Please install ArConnect first.')
    return
  }
  try {
    const rs = await window.arweaveWallet.connect([
      'ACCESS_ADDRESS',
      'ACCESS_PUBLIC_KEY',
      'SIGNATURE',
    ], {
      name: 'ECHO',
      logo: config['color-theme'] === 'dark' ? 'https://0xecho.com/favicon-white.ico' : 'https://0xecho.com/favicon.ico'
    })
    const address = await window.arweaveWallet.getActiveAddress()
    const publickey = await window.arweaveWallet.getActivePublicKey()

    const { message, signKeys } = getAuthMessage('arweave', address)
    const sig = await window.arweaveWallet.signature(new TextEncoder().encode(message), {
      name: 'RSA-PSS',
      saltLength: 0,
    })
    const hexed =  ethers.utils.hexlify(sig)
    await requestLogin(address, message, hexed, 'arweave', signKeys, publickey)
  } catch (e) {
    console.log(e)
    if ((e && e.includes && e.includes('cancell')) || (e.message && e.message.includes('cancell'))) {
      // manually remove arconnect overlay
      const el = document.querySelector('.arconnect_connect_overlay_extension_temporary')
      el.parentNode.removeChild(el)
    }
  }
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

  if (window.arweaveWallet) {
    try {
      window.arweaveWallet.disconnect().then(() => {})
    } catch (e) {}
  }
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
    likePage = 1
    await getReactions('like')
  }
}

const likeComment = async (data) => {
  await doReact((data.has_liked ? '-' : '') + 'like', data)
}

// dislike
const dislike = async (data) => {
  dislikePage = 1
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
  console.log('data', data)
  currentComment = data
  deleteDialogVisible.value = true
}
const deleteComment = async () => {
  console.log('go delete', currentComment, currentComment.id)
  try {
    const rs = await $fetch(commonConfig.api().DELETE_POST + currentComment.id, {
      method: 'DELETE',
      headers: getCommonHeader()
    })
    currentComment = null
    deleteDialogVisible.value = false
    ElMessage.success({
      message: 'Done.'
    })
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

const reactionLimit = 50
const getReactions = async (subType) => {
  const page = subType === 'like' ? likePage : dislikePage
  const params = {
    target_uri: TARGET_URI,
    page,
    limit: reactionLimit,
    sub_type: subType
  }

  try {
    isLoadingMoreLikes.value = true
    const { data: rs }= await $fetch(commonConfig.api().GET_REACTIONS, {
      params,
      headers: getCommonHeader()
    })
    console.log(rs)
    if (page === 1) {
      summary[subType + 's'] = rs.list
    } else {
      summary[subType + 's'].push(...rs.list)
    }
    const hasMore = ((page - 1) * reactionLimit + rs.list.length) < rs.total
    hasMoreLikes.value = hasMore
    store.setCounts(rs.target_summary)
    if (subType === 'like') {
      likePage++
    } else if (subType === 'dislike') {
      dislikePage++
    }
  } catch (e) {
    console.log(e)
  }
  isLoadingMoreLikes.value = false
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

        if (one.from_uri) {
          if (/opensea\.io/i.test(one.from_uri)) {
            one.from_app = 'OpenSea'
          }
          if (/looksrare\.org/i.test(one.from_uri)) {
            one.from_app = 'LooksRare'
          }
          if (/x2y2\.io/i.test(one.from_uri)) {
            one.from_app = 'X2Y2'
          }
          if (/element\.market/i.test(one.from_uri)) {
            one.from_app = 'element'
          }
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

    const body = {
      type,
      target_uri: TARGET_URI,
      parent_id: parentId,
      direct_parent_id: directParentId,
      content: parseContent(content, false),
      protocol_version: common.PROTOCOL_VERSION,
      id: uuidv4(),
      from_uri: config.from_uri || null
    }

    const signed = sign.sign(body)

    body.public_key = signed.publicKey
    body.signature = signed.signature

    const rs = await $fetch(commonConfig.api().CREATE_POST, {
      method: 'POST',
      body,
      headers: getCommonHeader()
    })

    if (rs.data.is_first_comment) {
      ElMessage.success({
        message: 'Congrats on your first echo!'
      })
      showConfetti()
    } else {
      ElMessage.success({
        message: 'Echo Sent!'
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

    const body = {
      type: 'reaction',
      sub_type: subType,
      target_uri: TARGET_URI,
      parent_id: data ? data.id : null,
      protocol_version: common.PROTOCOL_VERSION,
      id: uuidv4(),
      from_uri: config.from_uri || null
    }

    const signed = sign.sign(body)

    body.public_key = signed.publicKey
    body.signature = signed.signature

    const rs = await $fetch(commonConfig.api().CREATE_POST, {
      method: 'POST',
      body,
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

const refreshComments = async () => {
  const loadingMessage = $showLoading()

  try {
    await getList(1, store.last_got_time)
  } finally {
    loadingMessage.close()
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
  
  [class^="target_site_"] &,
  [class*=" target_site_"] & {
    padding: 30px 20px;
  }
  
  .has-v-padding & {
    padding-top: 30px;
  }
  
  .has-h-padding & {
    padding-right: 30px;
    padding-left: 30px;
  }
  
  &__reply {
    margin-bottom: 30px;
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

.walletconnect-qrcode {
  &__base {
    overflow: scroll !important;
  }
  
  &__text {
    display: none !important;
  }
  
  &__image {
    max-width: 300px;
  }
}

.walletconnect-modal {
  &__base {
    width: 80vh !important;
    max-width: 348px !important;
    top: 10vh !important;
    transform: none !important;
  }
  
  &__footer {
    margin-top: 10px !important;
  }
}

.walletconnect-connect {
  &__buttons__wrapper__wrap {
    grid-template-columns: repeat(2, 1fr) !important;
  } 
  
  &__button__icon_anchor {
    width: 50% !important;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .chat-widget {
    padding: 30px 20px !important; 
    
    .no-padding-in-mobile & {
      padding: 0 !important;
    }
  }
}

@media screen and (max-width: 500px) {
  .walletconnect-modal {
    &__base {
      max-width: 80vw !important;
    }
  }
}
</style>