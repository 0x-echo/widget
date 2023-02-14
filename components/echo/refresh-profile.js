import { echoMessage } from '~~/libs/helper'

export default (store) => {
  const refreshProfile = async () => {
    const { $showLoading } = useNuxtApp()
    const loadingMessage = $showLoading()
    
    try {
      await store.getScreenName(true)
      echoMessage.success({
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