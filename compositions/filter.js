import configParser from '~~/libs/config-parser'
import config from '../config'

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
    if (!store.filter.did) {
      return
    }
    const rs = await $fetch(config.api().GET_SUBDIDS, {
      params: {
        address: store.chain + '/' + store.address,
        did
      }
    })
    if (rs.data.subdids && rs.data.subdids.length) {
      store.setData('filter', {
        eligible: true,
        subdids: rs.data.subdids
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