import useStore from '~~/store'
import { ethers } from 'ethers'

const resolve = async (name) => {
  if (/\.eth$/.test(name)) {
    const data = await $fetch(`https://api.ensideas.com/ens/resolve/${name}`)
    return data
  } else if (/\.bit$/.test(name)) {
    const rs = {}
    const data = await $fetch(`https://indexer-v1.did.id/v1/account/info`, {
      method: 'POST',
      body: {
        account: name.toLowerCase()
      }
    })
    
    rs.address = data.data.account_info.manager_key

    const records = await $fetch(`https://indexer-v1.did.id/v1/account/records`, {
      method: 'POST',
      body: {
        account: name.toLowerCase()
      }
    })

    const avatarRs = records.data.records.find(one => one.key === 'profile.avatar')
    if (avatarRs && avatarRs.value) {
      rs.avatar = avatarRs.value
    }
    return rs
  } else { // 0x address
    try {
      const address = ethers.utils.getAddress(name)
      return {
        address,
        name: address,
        displayName: name.substr(0, 4) + '...' + name.substr(name.length - 4, 4),
        avatar: ''
      }
    } catch (e) {
      return {
        address: 'unknown',
        name: 'unknown',
        display: 'unknown',
        avatar: ''
      }
    }
  }
}

export default () => {
  const store = useStore()

  if (store.receiver.address) {
    return reactive(store.receiver)
  }

  const route = useRoute()
  const receiver = reactive({
    address: '',
    name: route.query.receiver,
    displayName: route.query.receiver,
    avatar: ''
  })

  if (route.query.receiver) {
    resolve(route.query.receiver).then(data => {
      Object.assign(receiver, data)
      store.setData('receiver', receiver)
    })
  }

  return {
    receiver
  }
}
