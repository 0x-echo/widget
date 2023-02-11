import { ElMessage } from 'element-plus'

export default (store) => {
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
      hasLiked: false,
      hasDisliked: false
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
  
  return {
    logout
  }
}