import { echoMessage } from '~~/libs/helper'
import { parseContent } from '@/libs/content-parser'
import { v4 as uuidv4 } from 'uuid'
const { public: { common }} = useRuntimeConfig()
import commonConfig from '@/config'
import useConnectWallet from './connect-wallet'
import useLibs from './libs'

export default (store) => {
  const { checkLoginStatus } = useConnectWallet(store)
  const { getCommonHeader } = useLibs(store)
  let currentReportPost = null
  
  const openReportDialog = async (data) => {
    currentReportPost = data
    store.setData('reportDialogVisible', true)
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
      
      echoMessage.success({
        message: 'Thank you!'
      })
      
      store.setData('reportDialogVisible', false)
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
    openReportDialog,
    submitReport
  }
}