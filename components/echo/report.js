import { ElMessage } from 'element-plus'
import { parseContent } from '@/libs/content-parser'
import useConnectWallet from './connect-wallet'
import useLibs from './libs'
import { v4 as uuidv4 } from 'uuid'
const { public: { common }} = useRuntimeConfig()

export default ({ store, reportDialogVisible }) => {
  const { checkLoginStatus } = useConnectWallet(store)
  const { getCommonHeader } = useLibs(store)
  let currentReportPost = null
  
  const openReportDialog = async (data) => {
    currentReportPost = data
    reportDialogVisible.value = true
  }
  
  const submitReport = async (reason) => {
    try {
      checkLoginStatus()
      const rs = await $fetch(commonConfig.api().CREATE_POST, {
        method: 'POST',
        body: {
          type: 'report',
          target_uri: store.widgetConfig.targetUri,
          parent_id: null,
          direct_parent_id: currentReportPost.id,
          content: parseContent(reason, false),
          protocol_version: common.PROTOCOL_VERSION,
          id: uuidv4()
        },
        headers: getCommonHeader()
      })
      
      ElMessage.success({
        message: 'Thank you!'
      })
      
      reportDialogVisible.value = false
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
    openReportDialog,
    submitReport
  }
}