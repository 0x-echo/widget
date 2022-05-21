import dayjs from 'dayjs'

const numberFormatter = Intl.NumberFormat('en', { notation: 'compact' });

export default defineNuxtPlugin(() => {
  return {
    provide: {
      formatNumber: (number) => {
        return numberFormatter.format(number)
      },
      ellipsisInMiddle: (str, length = 4) => {
        if (!str) {
          return str
        }
        if (str.length > length * 2) {
          return str.substr(0, length) + '...' + str.substr(str.length - length, length)
        }
        
        return str
      },
      formatDate: (date, format = 'YYYY-MM-DD HH:mm:ss') => {
        if (!date) {
          return date
        }
        return dayjs(date).format(format)
      }
    }
  }
})