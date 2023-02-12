import { storeToRefs } from "pinia"

export default (store) => {
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
    
        // if login from other tab, like arconnect
        store.setData('connectWalletDialogVisible', false)
      }
    } catch (e) {
      console.log('get login_info:', e)
    }
  }
  
  return {
    tryAutoLogin
  }
}