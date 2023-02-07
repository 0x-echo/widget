import { ElMessage } from 'element-plus'

export default () => {
  const viewArweaveInfo = (data) => {
    if (!data.ar_id) {
      ElMessage.info({
        message: 'The data is not yet sent to Arweave.'
      })
    }
  }
  
  return {
    viewArweaveInfo
  }
}