import { defineStore } from 'pinia'
import config from '../config'
import axios from 'axios'

console.log(config)
const useStore = defineStore('global', {
	state: () => ({
    counts: {
      like_counts: 0,
      dislike_counts: 0,
      tip_counts: 0
    },

    status: {
      onTransactionProcessing: false,
      onSubmitingTargetComment: false
    },

    widgetConfig: {
      show_comment_dislike: false
    },

    hasLogined: false,
    chain: '',
    address: '',
    token: '',
    avatar: '',
    screen_name: '',

    balance: 0,

    new_posts: 0,
    last_got_time: 0,

    tip_amount: 0,
    tip_network: '',
    currency:  {
      ethereum: {
        symbol: 'eth',
        usd: '',
        id: 1
      },
      polygon: {
        symbol: 'MATIC',
        usd: '',
        id: 137
      },
      mumbai: {
        symbol: 'MATIC',
        usd: '',
        id: 80001
      }
    }
  }),
	actions: {
    setWidgetConfig (data) {
      for (let i in data) {
        this.widgetConfig[i] = data[i]
      }
    },
    setStatus (obj) {
      for (let i in obj) {
        this.status[i] = obj[i]
      }
    },
    async updateBalance (account) {
      try {
        const rs = await window.ethereum.request({
          method: 'eth_getBalance',
          params: [account, 'latest']
        })
        console.log('got balance', rs)
        this.balance = rs
      } catch (e) {}
    },
    setCounts (counts) {
      for (let i in counts) {
        this.counts[i] = counts[i]
      }
    },
    setLogined (val) {
      this.hasLogined = val
    },
    setLastGotTime (val) {
      this.last_got_time = val
    },
    setNewPost (val) {
      this.new_posts = val
    },
    setLoginInfo (val) {
      for (let i in val) {
        this[i] = val[i]
      }
      try {
        if (val.address) {
          localStorage.setItem('login_info', JSON.stringify(val))
        }
      } catch (e) {}
    },
    setTipNetwork (val) {
      this.tip_network = val
    },
    setTipAmount (val) {
      this.tip_amount = val
    },
    async getCurrency () {
      const map = {
        'ethereum': 'ethereum',
        'polygon': 'matic-network'
      }
      const remap = {
        'ethereum': 'ethereum',
        'matic-network': 'polygon'
      }
      try {
        const ids = Object.keys(this.currency).map(one => map[one]).join(',')
        // const data = await $fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
        const { data: data } = await $fetch(config.api().CURRENCY)
        for (let i in data) {
          if (data[i].usd) {
            const name = remap[i]
            this.currency[name].usd = data[i].usd
            if (name === 'polygon') {
              this.currency['mumbai'].usd = data[i].usd
            }
          }
        }
      } catch (e) {}
    },
    async syncBalance () {
      try {
        const { data: rs } = await $fetch(config.api().SYNC_BALANCE, {
          method: 'POST',
          headers: {
            Authorization: `Bearer ${this.token}`
          }
        })
      } catch (e) {
        console.log('sync balance:', e)
      }
    },
    async getScreenName (force) {
      console.log('get screen name', this.address)
      try {
        const { data: rs } = await $fetch(config.api().GET_USER_INFO, {
          params: {
            address: this.chain + '/' + this.address,
            force: force ? 'true' : ''
          }
        })
        console.log('rs name', rs)
        // this.screen_name = rs.screen_name
        if (rs.dotbit || rs.ens) {
          this.screen_name = rs.dotbit || rs.ens
        }
        if (rs.avatar) {
          this.avatar = rs.avatar
        }
      } catch (e) {
        console.log(e)
      }
    }
  },
	getters: {
    getCounts: (state) => state.counts,
    getCurrentUser: (state) => {
      return state.chain + '/' + state.address
    }
  }
})

export default useStore
