import configParser from '~~/libs/config-parser'
import config from '../config'
import axios from 'axios'

export default (store) => {
  const parsed = configParser()
  let did
  if (parsed.filter_by === 'did') {
    if (parsed.filter_did) {
      did = parsed.filter_did
      store.setData('filter', {
        did: did,
        eligible: false
      })
    }
  }

  if (parsed.display_subdid === 'true') {
    store.setData('filter', {
      displaySubdid: true
    })
  }

  async function checkEligible () {
    const rs = await axios.get(config.api().GET_SUBDIDS, {
      params: {
        address: store.chain + '/' + store.address,
        did
      }
    })
    if (rs.data.data.subdids && rs.data.data.subdids.length) {
      store.setData('filter', {
        eligible: true,
        subdids: rs.data.data.subdids
      })
    } else {
      store.setData('filter', {
        eligible: false,
        subdids: []
      })
    }
  }

  return {
    checkEligible
  }
}