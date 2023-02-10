import useLibs from './libs'
import commonConfig from '@/config'

export default (store) => {
  const { getCommonHeader } = useLibs(store)
  
  const getWidgetData = async (loading) => {
    const { data: counts } = await $fetch(commonConfig.api().GET_TARGET_SUMMARY, {
      params: {
        target_uri: TARGET_URI
      },
      headers: getCommonHeader()
    })
    
    store.setCounts(counts)
    console.log(counts)
    loading.value = false
  }
  
  return {
    getWidgetData
  }
}