import { ElMessage } from 'element-plus'
const { $showLoading } = useNuxtApp()

export default (store) => {
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
  
  return {
    refreshProfile
  }
}