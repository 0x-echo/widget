import { echoMessage } from "~~/libs/helper"

export default () => {
  const viewArweaveInfo = (data) => {
    if (!data.ar_id) {
      echoMessage.info({
        message: 'The data is not yet sent to Arweave.'
      })
    }
  }
  
  return {
    viewArweaveInfo
  }
}