import { echoMessage } from '~~/libs/helper'
import { ethers } from "ethers"
import { v4 as uuidv4 } from 'uuid'
import EverPay from 'everpay'
import useConfetti from '~~/compositions/confetti'
import useConnectWallet from './connect-wallet'
import useLibs from './libs'
import useGetList from './get-list'

const { public: { common }} = useRuntimeConfig()
const { showConfetti } = useConfetti()

export default (store) => {
  const { checkLoginStatus } = useConnectWallet(store)
  const { $bus } = useNuxtApp()
  const { getTipList } = useGetList(store)
  const { getCommonHeader } = useLibs(store)
  let web3provider = null
  let checkTipInterval = null
  
  const openTipDialog = async () => {
    try {
      checkLoginStatus()
      store.setWallet({
        loginType: 'tip'
      })
      store.setData('tipDialogVisible', true)
      await store.getCurrency()    
    } catch (e) {
      console.log(e)
    }
  }
  
  const doTipLogin = async () => {
    if (store.tip.network === 'everpay') {
      const network = window.ethereum.networkVersion
      if (network.toString() !== '1') {
        echoMessage.error({
          message: 'Only Ethereum is supported'
        })
        return
      }
      const accounts = await ethereum.request({ method: 'eth_accounts' })
      if (!accounts.length) {
        echoMessage.error({
          message: 'No wallet is selected'
        })
        return
      }
  
      const provider = new ethers.providers.Web3Provider(window.ethereum)
      const signer = provider.getSigner()
      const everpay = new EverPay({
        account: window.ethereum.selectedAddress,
        chainType: 'ethereum',
        ethConnectedSigner: signer
      })
  
      const toAddress = store.receiver.address
  
      store.setStatus({
        onTransactionProcessing: true
      })
      $bus.emit('show-connect-loading', 'Please confirm the transaction...')
  
      const tipData = {
        type: 'tip',
        target_uri: TARGET_URI,
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4(),
        meta: {
          status: 'success',
          from_address: accounts[0],
          to_address: toAddress,
          value: data.everpayAmount,
          token: data.everpayToken,
          chain: 'ethereum',
          network: 'everpay'
        }
      }
  
      await submitTip(tipData)
  
      try {
        const rs = await everpay.transfer({
          tag: data.everpayToken,
          amount: data.everpayAmount,
          to: toAddress,
          data: {
            app: 'ECHO',
            website: 'https://0xecho.com',
            target_uri: config.target_uri
          }
        })
  
        if (rs.status !== 'ok') {
          echoMessage.error({
            message: rs.status
          })
          return
        }
  
        $bus.emit('hide-connect-loading')
        echoMessage.success({
          message: 'Thank you!'
        })
        store.setStatus({
          onTransactionProcessing: false
        })
        showConfetti()
        store.setData('tipDialogVisible', false)
        store.setData('connectWalletDialogVisible', false)
  
        tipData.meta.tx_hash = rs.everHash
        await submitTip(tipData)
        await getTipList()
      } catch (e) {
        console.log(e)
        echoMessage.error({
          message: e.message
        })
        return
      } finally {
        store.setStatus({
          onTransactionProcessing: false
        })
        $bus.emit('hide-connect-loading')
      }
      return
    }
    
    let currentProvider
    let tipNetworkId
    if (store.wallet.loginApp === 'metamask') {
      if (!window.ethereum) {
        echoMessage.error({
          message: 'Please install MetaMask first.'
        })
        return
      }
      currentProvider = window.ethereum
      const network = window.ethereum.networkVersion
      if (!network) {
        echoMessage.error({
          message: 'Seems MetaMask are swithing network. Wait a moment.'
        })
        return
      }
      const tipNetwork = store.tip.network
      tipNetworkId = store.currency[tipNetwork].id
      if (network.toString() !== tipNetworkId.toString()) {
        echoMessage.error({
          message: `Your are on the wrong network. Please switch to ${tipNetwork}`
        })
        return
      }
    } else if (store.wallet.loginApp === 'walletconnect') {
  
      const chain = await web3provider.getNetwork()
      const networkId = chain.chainId
      const tipNetworkId = store.currency[store.tip.network].id
      if (networkId.toString() !== tipNetworkId.toString()) {
        echoMessage.error({
          message: `Your are on the wrong network. Please switch to ${store.tip.network}`
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
      echoMessage.error({
        message: e.message
      })
      console.log(e)
      $bus.emit('hide-connect-loading')
      store.setStatus({
        onTransactionProcessing: false
      })
    }
  }
  
  const sendTip = async ({ currentProvider, account, chainId }) => {
    let gotSuccess = false // may trigger more than once due to the slow network
    let toAddress = store.receiver.address
    if (!toAddress) {
      echoMessage.error({
        message: 'Fail to resolve receiver\'s address.'
      })
      return
    }
    let value = store.tip.amount / (store.currency[store.tip.network].usd)
    console.log('value', value)
    if (value <= 0) {
      echoMessage.error({
        message: 'Something is wrong. Please try again later.'
      })
      return
    }
  
    const valueSplit = value.toString().split('.')
    value = valueSplit[0] + '.' + valueSplit[1].slice(0, 18)
  
    if (ethers.utils.getAddress(toAddress) === ethers.utils.getAddress(account)) {
      echoMessage.error({
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
        target_uri: store.widgetConfig.targetUri,
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4(),
        meta: {
          from_address: account,
          to_address: toAddress,
          usd_value: store.tip.amount,
          value,
          chain: chainId,
          tx_hash: txHash,
          currency: store.currency[store.tip.network].usd,
          network: store.currency[store.tip.network]
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
          echoMessage.success({
            message: 'Thank you!'
          })
          store.setStatus({
            onTransactionProcessing: false
          })
          showConfetti()
          store.setData('tipDialogVisible', false)
          store.setData('connectWalletDialogVisible', false)
          data.meta.status = 'success'
          await submitTip(data)
          await getTipList()
        }
      }, commonConfig.wallet.transaction_check_interval)
    })
    .catch((error) => {
      $bus.emit('hide-connect-loading')
      store.setStatus({
        onTransactionProcessing: false
      })
      console.log('send tip error:', error)
      echoMessage.error({
        message: error.message
      })
      if (error.message.includes('unable to sign')) {
        provider && provider.disconnect()
      }
    });
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
        echoMessage.error({
          message: e.response._data.msg
        })
      }
    }
  }
  
  return {
    openTipDialog,
    doTipLogin
  }
}