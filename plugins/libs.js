import dayjs from 'dayjs'
import { ethers } from 'ethers'
import { ElMessage } from 'element-plus'

const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' });

export default defineNuxtPlugin(() => {
  return {
    provide: {
      processAvatarUri: (url) => {
        if (!url) {
          return url
        }
        if (/^ipfs:/.test(url)) {
          return url
          .replace('ipfs://ipfs/', 'https://ipfs.io/ipfs/') // 有可能路径本身是错的
          .replace('ipfs://', 'https://ipfs.io/ipfs/')
        }
        return url
      },
      formatAddress: (address) => {
        if (/^0x/.test(address)) {
          return ethers.utils.getAddress(address)
        } else {
          return address
        }
      },
      formatScreenName: (name) => {
        if (name.includes('.')) {
          return name
          // if (name.length > 15) {
          //   const splits = name.split('.')
          //   if (splits.length === 2) {
          //     return splits[0].substr(0, 15 - splits[1].length - 1) + '.' + splits[1]
          //   }
          //   if (splits.length === 3) {
          //     return (splits[0] + '.' + splits[1]).substr(0, 15 - splits[1].length - 1) + '.' + splits[1]
          //   }
          // } else {
          //   return name
          // }
        } else {
          return ellipsisInMiddle(name)
        }
      },
      formatNumber: (number) => {
        return numberFormatter.format(number) 
      },
      ellipsisInMiddle,
      formatDate: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
        if (!date) {
          return date
        }
        return dayjs(date).format(format)
      },
      showLoading
    }
  }
})

function ellipsisInMiddle (str, length = 4) {
  if (!str) {
    return str
  }
  if (str.length > length * 2) {
    return str.substr(0, length) + '...' + str.substr(str.length - length, length)
  }
  
  return str
}

function showLoading () {
  return ElMessage({
    customClass: 'el-message--no-icon',
    message: () => h('div', { class: 'chat-loader', style: 'width: 20px; height: 20px;border-color:#4E75F6;'}, ''),
    duration: 0
  })
}