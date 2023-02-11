import useLibs from './libs'
import commonConfig from '@/config'

export default (store) => {
  const { getCommonHeader } = useLibs(store)
  
  const getWidgetData = async () => {
    const { data: counts } = await $fetch(commonConfig.api().GET_TARGET_SUMMARY, {
      params: {
        target_uri: store.widgetConfig.targetUri
      },
      headers: getCommonHeader()
    })
    
    store.setCounts(counts)
    store.status.loading = false
  }
  
  return {
    getWidgetData
  }
}