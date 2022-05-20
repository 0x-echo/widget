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

    hasLogined: false,
    chain: '',
    address: '',
    token: '',
    avatar: '',
    screen_name: '',

    balance: 0,

    new_posts: 0,
    last_got_time: 0
  }),
	actions: {
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
        localStorage.setItem('login_info', JSON.stringify(val))
      } catch (e) {}
    },
    async getScreenName () {
      console.log('get screen name', this.address)
      try {
        const { data: rs } = await $fetch(config.api.GET_USER_INFO, {
          params: {
            address: this.chain + '/' + this.address
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
