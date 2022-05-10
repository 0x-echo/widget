export default defineNuxtPlugin(() => {
  return {
    provide: {
      ellipsisInMiddle: (str, length = 4) => {
        if (!str) {
          return str
        }
        if (str.length > length * 2) {
          return str.substr(0, length) + '...' + str.substr(str.length - length, length)
        }
        
        return str
      }
    }
  }
})