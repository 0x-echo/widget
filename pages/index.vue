<template>
  <div
    ref="scrollComponent"
    class="chat-widget">
    <template
      v-if="widgetType === 'mix-widget'">
      <template-tabs
        :config="config"
        :data="summary"
        :loading="loading"
        v-model="message"
        @connect-wallet="goConnectWallet"
        @tip="tip"
        @dislike="dislike"
        @dislike-comment="dislikeComment"
        @logout="logout"
        @refresh-comments="refreshComments"
        @reply="reply"
        @reply-comment="replyComment"
        @like="like"
        @like-comment="likeComment">
      </template-tabs>
      
      <chat-footer
        v-if="!loading">
      </chat-footer>
    </template>
    
    <section-toolbar
      v-if="widgetType === 'lite-only'"
      :config="config"
      :loading="loading"
      @connect-wallet="connectDialogVisible = true"
      @tip="tip"
      @dislike="dislike"
      @logout="logout"
      @like="like">
    </section-toolbar>
    
    <div
      class="chat-widget__container"
      v-if="widgetType === 'comment-only'">
      <reply-form
        custom-class="chat-widget__reply"
        :loading="loading"
        v-model="message"
        @reply="reply">
      </reply-form>
    
      <section-comment
        :data="summary.comments"
        :loading="loading"
        @dislike-comment="dislikeComment"
        @refresh-comments="refreshComments"
        @reply-comment="replyComment"
        @like-comment="likeComment">
      </section-comment>
    </div>
    
    <template-list
      v-if="['like-only', 'dislike-only', 'tip-only'].includes(widgetType)"
      :data="data"
      :loading="loading"
      :module="config.modules[0]"
      @dislike="dislike"
      @tip="tip"
      @like="like">
    </template-list>
    
    <dialog-connect
      v-model="connectDialogVisible"
      @connect-wallet="connectWallet">
    </dialog-connect>
    
    <dialog-tip
      v-model="tipDialogVisible"
      @go-next="tipLogin">
    </dialog-tip>
  </div>
</template>

<script setup>
import configParser from '../libs/config-parser'
import { v4 as uuidv4 } from 'uuid'
import { ElMessage } from 'element-plus'

import { parseContent } from '../libs/content-parser'
import { setColorTheme, getDraft, setDraft } from '../libs/helper'

const { public: { api, common }} = useRuntimeConfig()
import useStore from '~~/store';

console.log('ethereum', window.ethereum)


const { $bus } = useNuxtApp()
const store = useStore()

const CHECK_INTERVAL = 60 * 1000

// connect wallet / disconnect wallet
let connectDialogVisible = ref(false)

const getCommonHeader = () => {
  const token = store.token
  return {
    Authorization: `Bearer ${token}`
  }
}

const beforePost = () => {
  if (!store.hasLogined) {
    connectDialogVisible.value = true
    throw new Error('PLEASE LOGIN FIRST')
  }
  console.log('store balance', store.balance, store.balance === 0x0, store.balance === 0, store.balance.toString())
  if (store.balance.toString() === '0x0') {
    ElMessage.error({
      message: 'Sorry. Please make sure your balance is greater than 0.'
    })
    throw new Error('BALANCE SHOULD NOT BE ZERO')
  }
}

const defaultConfig = {
  'color-theme': 'auto'
}
const config = reactive(Object.assign(defaultConfig, configParser()))

let checkInterval = null

onMounted(async () => {

  window.addEventListener('storage', function () {
    console.log('storage change val')
  })

  if (config.modules.includes('comment')) {
    const draft = getDraft(TARGET_URI)
    if (draft) {
      message.value = draft
    }

    checkInterval = setInterval(async () => {
      try {
        const { data } = await $fetch(api.CHECK_POST, {
          params: {
            target_uri: TARGET_URI,
            since: store.last_got_time
          },
          headers: getCommonHeader()
        })
        store.setNewPost(data.count)
      } catch (e) {}
    }, CHECK_INTERVAL)

    window.addEventListener("scroll", handleScroll)
  } else {
    await getSummary()
  }

  // window.ethereum.on('accountsChanged', async (accounts) => {
  //   console.log('account changed', accounts)
  //   await connectWallet()
  // })
})

const scrollComponent = ref(null)

const handleScroll = async (e) => {
  let element = scrollComponent.value;
  if (element.getBoundingClientRect().bottom <= window.innerHeight + 100) {
    if (page >= totalPage) {
      return
    }
    if (!onFetch) {
      await getList(++page)
    }
  }
};

onBeforeUnmount(() => {
  checkInterval && clearInterval(checkInterval)
})

if (config['color-theme'] === 'auto') {
  if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
    setColorTheme('dark')
  }

  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    const newColorScheme = event.matches ? "dark" : "light";
    setColorTheme(newColorScheme)
  })
} else {
  setColorTheme(config['color-theme'])
}

const TARGET_URI = config.target_uri || 'demo'

// internal data
let loading = ref(true)
let hasLoaded = ref(false)

let page = 1
let onFetch = false
let totalPage = 1
let limit = 20

// store.setLogined(true)

{
  try {
    const info = localStorage.getItem('login_info')
    const _info = JSON.parse(info)
    if (_info && _info.chain) {
      store.setLogined(true)
      store.setLoginInfo({
        chain: _info.chain,
        address: _info.address,
        token: _info.token,
        screen_name: _info.screen_name,
        avatar: _info.avatar
      })
      setTimeout(async () => {
        await store.updateBalance(_info.address)
        await store.getScreenName()
      }, 100)
    }
  } catch (e) {}
}

let message = ref('')

watch(message, (val) => {
  setDraft(TARGET_URI, message.value)
})

var url = (window.location != window.parent.location)
            ? document.referrer
            : document.location.href;

console.log('origin', window.location.ancestorOrigins[0])

const login = async () => {
  console.log('go connect wallet')
  console.log('network', window.ethereum.networkVersion)
  let account
  let accounts = await ethereum.request({ method: 'eth_accounts' })
  let signature
  const message = 'I authorize'
  console.log('accounts', accounts)
  if (!accounts.length) {
    accounts = await ethereum.request({ method: 'eth_requestAccounts' })
  }
  console.log('accounts2', accounts)
  if (accounts.length) {
    account = accounts[0]
    signature = await ethereum.request({ method: 'personal_sign', params: [ message, account ] })
    console.log('signature', signature)

    try {
      const { data: rs } = await $fetch(api.CREATE_USER, {
        method: 'POST',
        body: {
          chain: `EVM/${window.ethereum.networkVersion}`,
          address: account,
          message,
          signature
        },
        headers: getCommonHeader()
      })
      console.log(rs)

      connectDialogVisible.value = false

      store.setLogined(true)
      store.setLoginInfo({
        chain: rs.chain,
        address: rs.address,
        token: rs.token,
        screen_name: rs.screen_name,
        avatar: rs.avatar
      })

      await store.updateBalance(account)

      setTimeout(async () => {
        await store.getScreenName()
      }, 100)
    } catch (e) {
      console.log(e)
    }
    
  }
}

const connectWallet =  async () => {
  await login()
}

const goConnectWallet = async () => {
  connectDialogVisible.value = true
}


const logout = () => {
  store.setLogined(false)
  store.setLoginInfo({
    chain: '',
    address: '',
    screen_name: ''
  })
  localStorage.removeItem('login_info')
  console.log('logout')
}

// like
const like = async (data) => {
  await doReact((data ? '-' : '') + 'like')
  console.log('like', data)
}

const likeComment = async (data) => {
  await doReact((data.has_liked ? '-' : '') + 'like', data.id)
  data.has_liked = false
  console.log(data)
}

// dislike
const dislike = async (data) => {
  await doReact((data ? '-' : '') + 'dislike')
  console.log('dislike', data)
}

const dislikeComment = async (data) => {
  await doReact((data.has_disliked ? '-' : '') + 'dislike', data.id)
  data.has_disliked = false
  console.log(data)
}

// tip
const tipDialogVisible = ref(false)

const tip = () => {
  tipDialogVisible.value = true
}

const tipLogin = (data) => {
  console.log(data)
  connectDialogVisible.value = true
}

const getSummary = async () => {
  const { data: counts } = await $fetch(api.GET_TARGET_SUMMARY, {
    params: {
      target_uri: TARGET_URI
    },
    headers: getCommonHeader()
  })
  store.setCounts(counts)
  loading.value = false
}

const getList = async (page = 1, since) => {
  if (onFetch) {
    return
  } else {
    onFetch = true
  }

  try {
  const { data: rs }= await $fetch(api.GET_POST, {
    params: {
      target_uri: TARGET_URI,
      since,
      page
    },
    headers: getCommonHeader()
  })

  
  if (since) {
    for (let i in rs.list) {
      comments = [...rs.list, ...summary.comments]
    }
  } else {
    if (page === 1) {
      comments = rs.list
    } else {
      comments = [...summary.comments, ...rs.list]
    }
  }
  summary.comments = comments
  summary.counts = rs.target_summary

  store.setCounts(rs.target_summary)
  if (page === 1) {
    totalPage = Math.ceil(rs.total / limit)
    store.setLastGotTime(new Date().getTime())
    store.setNewPost(0)
  }

  if (!hasLoaded.value) {
    hasLoaded.value = true
    loading.value = false
  }
  } catch (e) {
    console.log(e)
    ElMessage.error({
      message: 'Indexer error.'
    })
  }
  onFetch = false
}

const doReply = async (content, parentId, directParentId, successCallback) => {
   try {
     beforePost()
    const rs = await $fetch(api.CREATE_POST, {
      method: 'POST',
      body: {
        type: 'comment',
        target_uri: TARGET_URI,
        parent_id: parentId,
        direct_parent_id: directParentId,
        content: parseContent(content, false),
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4()
      },
      headers: getCommonHeader()
    })
    ElMessage.success({
      message: 'Sent!'
    })
    if (successCallback) {
      successCallback()
    }
    getList()
  } catch (e) {
    console.log(e)
    if (e.response && e.response._data) {
      ElMessage.error({
        message: e.response._data.msg
      })
    }
  }
}


const doReact = async (subType, id) => {
   try {
    beforePost()
    const rs = await $fetch(api.CREATE_POST, {
      method: 'POST',
      body: {
        type: 'reaction',
        sub_type: subType,
        target_uri: TARGET_URI,
        parent_id: id,
        protocol_version: common.PROTOCOL_VERSION,
        id: uuidv4()
      },
      headers: getCommonHeader()
    })
    // ElMessage.success({
    //   message: 'Done!'
    // })
    getList()
  } catch (e) {
    console.log(e)
    if (e.response && e.response._data) {
      ElMessage.error({
        message: e.response._data.msg
      })
    }
  }
}

// comment
const reply = async () => {
  console.log(message.value)
  console.log($fetch)
  await doReply(message.value, null, null, function () {
    message.value = ''
    setDraft(TARGET_URI, '')
  })
  // console.log(rs)
}

const replyComment = async (data) => {
  console.log('data', data)
  await doReply(data.message, null, data.data.id)
  $bus.emit('reset-reply-comment', data.data)
}

const refreshComments = () => {
  console.log('refresh-comments')
  getList(1, store.last_got_time)
}

const widgetType = computed(() => {
  const modules = config.modules
  let liteCount = 0
  modules.forEach(item => {
    if (item.endsWith('lite')) {
      liteCount++
    }
  })
  
  if (modules.length === liteCount) {
    return 'lite-only'
  } else {
    if (modules.length === 1) {
      return `${modules[0]}-only`
    } else {
      return 'mix-widget'
    }
  }
})

let summary = reactive({})
let comments = reactive([])

if (config.modules.includes('comment')) {
  getList()
}
</script>

<script>
export default {
  data () {
    return {
      data: {
        name: 'hello.bit',
        bio: 'Hello world, hello world',
        avatar: '',
        comments_2: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          created_at: '2022-10-10 10:00',
          content: 'Hi, May I ask if you interested to sell your Bzuki to me? Someone scammed my pfp and I lost it, so happened that you are holding almost the same traits with mine..',
          replies: [{
            id: '11',
            name: 'chatchat.bit',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            created_at: '2022-10-10 10:00',
            content: 'hello',
            reply_to: 'hello.bit'
          }, {
            id: '12',
            name: 'chatchat.bit',
            avatar: '',
            created_at: '2022-10-10 10:00',
            content: 'Scammer! You scam my ETH without sending me NFT'
          }, {
            id: '13',
            name: 'chatchat.bit',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            created_at: '2022-10-10 10:00',
            content: 'hello'
          }, {
            id: '14',
            name: 'chatchat.bit',
            avatar: 'https://cube.elemecdn.com/0/88/03b0d39583f48206768a7534e55bcpng.png',
            created_at: '2022-10-10 10:00',
            content: 'Hi, May I ask if you interested to sell your Bzuki to me? Someone scammed my pfp and I lost it, so happened that you are holding almost the same traits with mine..'
          }]
        }, {
          id: '2',
          avatar: '',
          name: 'hello.bit',
          created_at: '2022-10-10 10:00',
          content: 'Hi, May I ask if you interested to sell your Bzuki to me? Someone scammed my pfp and I lost it, so happened that you are holding almost the same traits with mine..',
          replies: []
        }],
        donations: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          created_at: '1 day ago'
        }],
        downvotes: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }, {
          id: '2',
          avatar: '',
          name: 'chatchat.bit',
          asset: '120k'
        }, {
          id: '3',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }],
        upvotes: [{
          id: '1',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }, {
          id: '2',
          avatar: '',
          name: 'chatchat.bit',
          asset: '120k'
        }, {
          id: '3',
          avatar: '',
          name: 'hello.bit',
          asset: '120k'
        }]
      }
    }
  }
}
</script>

<style lang="scss">
.chat-widget {
  width: 100%;
  padding: 30px 0;
  
  .has-h-padding & {
    padding: 30px;
  }
  
  &__container {
    max-width: 800px;
  }
  
  &__reply {
    margin-bottom: 30px;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .chat-widget {
    padding: 30px 20px;
  }
}
</style>