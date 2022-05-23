import dayjs from 'dayjs'
import { ethers } from 'ethers'

const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' });

export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatAddress: (address) => {
        return ethers.utils.getAddress(address)
      },
      formatScreenName: (name) => {
        if (name.includes('.')) {
          if (name.length > 15) {
            const splits = name.split('.')
            if (splits.length === 2) {
              return splits[0].substr(0, 15 - splits[1].length - 1) + '.' + splits[1]
            }
            if (splits.length === 3) {
              return (splits[0] + '.' + splits[1]).substr(0, 15 - splits[1].length - 1) + '.' + splits[1]
            }
          } else {
            return name
          }
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
      }
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