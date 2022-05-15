<template>
  <div
    class="chat-widget">
    <template
      v-if="widgetType === 'mix-widget'">
      <template-tabs
        :config="config"
        :data="summary"
        :loading="loading"
        v-model="message"
        @connect-wallet="connectDialogVisible = true"
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
        @upvote-comment="upvoteComment">
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
import xss from 'xss'

const { public: { api, common }} = useRuntimeConfig()
const TARGET_URI = 'hello3'

const { $bus } = useNuxtApp()

// data
const config = reactive(configParser())

// internal data
let loading = ref(false)
let message = ref('')

// connect wallet / disconnect wallet
const connectDialogVisible = ref(false)
const connectWallet =  () => {
  connectDialogVisible.value = true
}

const logout = () => {
  console.log('logout')
}

// like
const like = async () => {
  await doReact('like')
  console.log('like')
}

const likeComment = async (data) => {
  await doReact('like', data.id)
  console.log(data)
}

// dislike
const dislike = async () => {
  await doReact('dislike')
  console.log('dislike')
}
    
const dislikeComment = async (data) => {
  await doReact('dislike', data.id)
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

const getList = async () => {
  console.log('get list')
  const { data: rs }= await $fetch(api.GET_POST, {
    params: {
      target_uri: TARGET_URI
    }
  })
  console.log('rs', rs)
  comments = rs.list
  summary.comments = comments
}

const doReply = async (content, parentId) => {
   try {
    const rs = await $fetch(api.CREATE_POST, {
      method: 'POST',
      body: {
        type: 'comment',
        target_uri: TARGET_URI,
        parent_id: parentId,
        content: xss(content, {
          whiteList: {}, // empty, means filter out all tags
          stripIgnoreTag: true, // filter out all HTML not in the whitelist
          stripIgnoreTagBody: ["script"], // the script tag is a special case, we need
        }),
        protocol_version: common.PROTOCOL_VERSION,
        created_by: 'eth/1/0xFEA384b1cf76C495FA44D6f54F5702F778e00000',
        id: uuidv4()
      }
    })
    ElMessage.success({
      message: 'Sent!'
    })
    getList()
  } catch (e) {
    console.log(e)
    console.log('res', e.response._data)
  }
}


const doReact = async (subType, id) => {
   try {
    const rs = await $fetch(api.CREATE_POST, {
      method: 'POST',
      body: {
        type: 'reaction',
        sub_type: subType,
        target_uri: TARGET_URI,
        parent_id: id,
        protocol_version: common.PROTOCOL_VERSION,
        created_by: 'eth/1/0xFEA384b1cf76C495FA44D6f54F5702F778e00000',
        id: uuidv4()
      }
    })
    ElMessage.success({
      message: 'Done!'
    })
    getList()
  } catch (e) {
    console.log(e)
    console.log('res', e.response._data)
  }
}

// comment
const reply = async () => {
  console.log(message.value)
  console.log($fetch)
  await doReply(message.value)
  
  // console.log(rs)
  message.value = ''
}

const replyComment = async (data) => {
  console.log('data', data)
  await doReply(data.message, data.data.id)
  $bus.emit('reset-reply-comment', data.data)
}

const refreshComments = () => {
  console.log('refresh-comments')
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

getList()
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
  padding: 30px;
  
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