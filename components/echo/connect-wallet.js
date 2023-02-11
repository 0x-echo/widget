import { ElMessage } from 'element-plus'
import { providers, ethers } from "ethers"
import commonConfig from '@/config'
import useSign from '~~/compositions/sign'
import base58 from 'bs58'
import useLibs from './libs'
import useGetWidgetData from './get-widget-data'

const sign = useSign()
const GetWalletConnectProvider = () => import('@walletconnect/web3-provider/dist/umd/index.min.js')

export default ({ store, connectWalletDialogVisible }) => {
  const { $bus, $showLoading } = useNuxtApp()
  const { getCommonHeader } = useLibs(store)
  const { getWidgetData } = useGetWidgetData(store)
  let provider = null
  let web3provider = null
  
  const openConnectWalletDialog = async () => {
    store.setWallet({
      loginType: 'login'
    })
    connectWalletDialogVisible.value = true
  }
  
  const checkLoginStatus = () => {
    if (!store.hasLogined) {
      connectWalletDialogVisible.value = true
      throw new Error('PLEASE LOGIN FIRST')
    }
  }
  
  const connectWallet =  async (item) => {
    store.setWallet({
      loginApp: item.value
    })
    
    if (item.value === 'metamask') {
      await metamaskLogin()
    } else if (item.value === 'walletconnect') {
      await setUpProvider()
      try {
        await provider.enable()
      } catch (e) {
        console.log('walletconnect enable error', e)
        await provider.disconnect()
      }
    } else if (item.value === 'phantom') {
      await phantomLogin()
    } else if (item.value === 'arconnect') {
      await arconnectLogin()
    } else {
      ElMessage.error(`Unsupported login method: ${item.name}`)
    }
  }
  
  // login with metamask
  const metamaskLogin = async () => {
    if (store.wallet.loginType === 'login') {
      await doMetamaskAccountLogin()
    } else if (store.wallet.loginType === 'reselect') {
      console.log('Reselect wallet')
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
      connectWalletDialogVisible.value = false
    }
  }
  
  const doMetamaskAccountLogin = async () => {
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

      connectWalletDialogVisible.value = false

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
      
      store.setData('status', {
        loginOnCurrentPage: true
      })

      if (provider) {
        try {
          await provider.disconnect()
        } catch (e) {}
      }

      await getWidgetData()

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
  
  // comment is a action that should be more serious, so we are not going to support auto-submitting it.
  const afterLogin = async () => {
    if (store.login.beforeAction) {
      // if already did, ignore
      if (!store.counts[`has${store.login.beforeAction.toUpperCase()}d`]) {
        try {
          await doReaction(store.login.beforeAction)
        } catch (e) {}
      }
      // reset to empty whether succeeded or not
      store.setData('login', {
        beforeAction: ''
      })
    }
  }
  
  // WalletConnect cannot reopen dialog, so recreate an instance each time dialog is closed.
  const getProvider = async () => {
    const { default: WalletConnectProvider } = await GetWalletConnectProvider()
    const provider = new WalletConnectProvider ({
      infuraId: "dda2473ca43f4555926534d427abc648",
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
  
  // login with Walletconnect
  //  Enable session (triggers QR Code modal)
  const setUpProvider = async () => {
    const rs = await getProvider()
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
  
  // login with Phantom
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
      await phantomSign(key)
    } catch (err) {
      console.log(err)
      ElMessage.error({
        message: err.message
      })
    } finally {
      $bus.emit('hide-connect-loading')
    }
  }
  
  const phantomSign = async (key) => {
    const { message, signKeys } = getAuthMessage('solana', key)
    const encodedMessage = new TextEncoder().encode(message);
    const signedMessage = await window.solana.signMessage(encodedMessage, 'utf-8')
    await requestLogin(key, message, base58.encode(signedMessage.signature), 'solana', signKeys)
  }
  
  
  // login with Arconnect
  const arconnectLogin = async () => {
    if (!store.env.inIframe && !window.arweaveWallet) {
      ElMessage.error('Please install ArConnect first.')
      
      if (config.action === 'authorize_arconnect') {
        setTimeout(() => {
          window.close()
        }, 2000)
      }
      return
    }
    try {
      const rs = await window.arweaveWallet.connect([
        'ACCESS_ADDRESS',
        'ACCESS_PUBLIC_KEY',
        'SIGNATURE',
      ], {
        name: 'ECHO',
        logo: props.config['color-theme'] === 'dark' ? 'https://0xecho.com/favicon-white.ico' : 'https://0xecho.com/favicon.ico'
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
  
      if (config.action === 'authorize_arconnect') {
        window.close()
        return
      }
    } catch (e) {
      console.log(e)
      if ((e && e.includes && e.includes('cancell')) || (e.message && e.message.includes('cancell'))) {
        // manually remove arconnect overlay
        const el = document.querySelector('.arconnect_connect_overlay_extension_temporary')
        el.parentNode.removeChild(el)
      }
    }
  }
  
  return {
    openConnectWalletDialog,
    connectWallet
  }
}