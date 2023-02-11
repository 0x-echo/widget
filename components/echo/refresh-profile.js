import { ElMessage } from 'element-plus'

export default (store) => {
  const refreshProfile = async () => {
    const { $showLoading } = useNuxtApp()
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
  
  return {
    refreshProfile
  }
}