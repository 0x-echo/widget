// @important All new keys must be UpperCase

import { defineStore } from 'pinia'
import config from '../config'
import axios from 'axios'
// import solana from '../libs/sol'

const useStore = defineStore('global', {
	state: () => ({
    counts: {
      like_counts: 0,
      dislike_counts: 0,
      tip_counts: 0
    },

    status: {
      onTransactionProcessing: false,
      onSubmitingComment: false,
      onSubmitingReply: false
    },

    widgetConfig: {
      show_comment_dislike: false,
      modules: []
    },

    env: {
      colorTheme: 'light',
      inIframe: self !== top
    },

    receiver: {
      name: '',
      displayName: '',
      address: '',
      avatar: ''
    },

    wallet: {
      loginType: 'login', // or tip
      loginApp: 'metamask', // or walletconnect
      connectedAccounts: [],
      tipWallet: ''
    },

    layout: {
      currentTab: ''
    },

    login: {
      beforeAction: ''
    },

    comment: {
      hasMore: true,
      isLoadingMore: false
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
        symbol: 'ETH',
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
      },
      optimism: {
        symbol: 'op',
        usd: '',
        id: 10
      },
      bsc: {
        symbol: 'BNB',
        usd: '',
        id: 56
      }
    }
  }),
	actions: {
    setData (module, data) {
      if (!module) {
        return
      }
      if (typeof data !== 'object') {
        return
      }
      for (let i in data) {
        this[module][i] = data[i]
      }
    },
    isMe (fullAddress) {
      if (!this.hasLogined) {
        return false
      }
      return fullAddress === (this.chain + '/' + this.address)
    },
    setLayout (data) {
      for (let i in data) {
        this.layout[i] = data[i]
      }
    },
    setWallet (data) {
      for (let i in data) {
        this.wallet[i] = data[i]
      }
    },
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
      if (/^0x/i.test(account)) {
        try {
          const rs = await window.ethereum.request({
            method: 'eth_getBalance',
            params: [account, 'latest']
          })
          this.balance = rs
        } catch (e) {}
      } else {
        // @todo server logic
        // let connection = new solana.Connection(solana.clusterApiUrl('testnet')) // mainnet-beta, testnet, or devnet
        // console.log(connection)
        // // async function
        // setTimeout(async () => {
        //   const rs = await connection.getBalance(window.solana.publicKey)
        //   console.log(rs / solana.LAMPORTS_PER_SOL)
        //   this.balance = rs / solana.LAMPORTS_PER_SOL
        // })
      }
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
        'polygon': 'matic-network',
        'bsc': 'binancecoin'
      }
      const remap = {
        'ethereum': 'ethereum',
        'matic-network': 'polygon',
        'binancecoin': 'bsc'
      }
      try {
        const ids = Object.keys(this.currency).map(one => map[one]).filter(one => !!one).join(',')
        // https://api.coingecko.com/api/v3/coins/list
        // const data = await $fetch(`https://api.coingecko.com/api/v3/simple/price?ids=${ids}&vs_currencies=usd`)
        const { data: data } = await $fetch(config.api().CURRENCY, {
          params: {
            ids
          }
        })
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
          method: 'GET',
          params: {
            chain: this.chain,
            address: this.address
          }
        })
      } catch (e) {
        console.log('sync balance error:', e)
      }
    },
    async logout () {
      this.setLogined(false)
      this.setLoginInfo({
        chain: '',
        address: '',
        screen_name: '',
        avatar: '',
        balance: ''
      })
      this.setCounts({
        has_liked: false,
        has_disliked: false
      })
      try {
        localStorage.removeItem('login_info')
      } catch (e) {}
    },
    async getScreenName (force) {
      if (!this.chain || !this.address) {
        console.error('user: fail to get screen name')
        return
      }
      try {
        const { data: rs } = await $fetch(config.api().GET_USER_INFO, {
          params: {
            address: this.chain + '/' + this.address,
            force: force ? 'true' : ''
          }
        })
        if (!rs) {
          return
        }
        if (rs.dotbit || rs.ens) {
          this.screen_name = rs.dotbit || rs.ens
        }
        if (rs.avatar) {
          this.avatar = rs.avatar
        }

        // logout user if JWT expires
        // @todo need improvement
        // if (!rs.has_logined && this.hasLogined) {
        //   console.log('NOT IN LOGINED STATUS')
        //   this.logout()
        // }
      } catch (e) {
        console.log(e)
        if (e.message.includes('404')) {
          console.log('USER NOT FOUND')
          this.logout()
        }
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
