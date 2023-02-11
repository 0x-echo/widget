import { ElMessage } from 'element-plus'
import { ethers } from "ethers"
import { v4 as uuidv4 } from 'uuid'
import useLibs from './libs'

export default (store) => {
  const { $bus } = useNuxtApp()
  const { getCommonHeader } = useLibs(store)
  let web3provider = null
  let checkTipInterval = null
  
  const openTipDialog = async (tipDialogVisible) => {
    try {
      checkLoginStatus()
      store.setWallet({
        loginType: 'tip'
      })
      tipDialogVisible.value = true
      await store.getCurrency()    
    } catch (e) {
      console.log(e)
    }
  }
  
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
        target_uri: store.widgetConfig.targetUri,
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
          connectWalletDialogVisible.value = false
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
      ElMessage.error({
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
        ElMessage.error({
          message: e.response._data.msg
        })
      }
    }
  }
  
  return {
    openTipDialog,
    doTipLogin,
    submitTip
  }
}