<template>
  <div
    class="chat-widget">
    <template
      v-if="widgetType === 'mix-widget'">
      <template-tabs
        :config="config"
        :data="data"
        :loading="loading"
        v-model="message"
        @connect-wallet="connectDialogVisible = true"
        @donate="donate"
        @downvote="downvote"
        @downvote-comment="downvoteComment"
        @logout="logout"
        @refresh-comments="refreshComments"
        @reply="reply"
        @reply-comment="replyComment"
        @upvote="upvote"
        @upvote-comment="upvoteComment">
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
      @donate="donate"
      @downvote="downvote"
      @logout="logout"
      @upvote="upvote">
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
        :data="data.comments"
        :loading="loading"
        @downvote-comment="downvoteComment"
        @refresh-comments="refreshComments"
        @reply-comment="replyComment"
        @upvote-comment="upvoteComment">
      </section-comment>
    </div>
    
    <template-list
      v-if="['upvote-only', 'downvote-only', 'donate-only'].includes(widgetType)"
      :data="data"
      :module="config.modules[0]"
      @downvote="downvote"
      @donate="donate"
      @upvote="upvote">
    </template-list>
    
    <dialog-connect
      v-model="connectDialogVisible"
      @connect-wallet="connectWallet">
    </dialog-connect>
    
    <dialog-donate
      v-model="donateDialogVisible"
      @go-next="donateLogin">
    </dialog-donate>
  </div>
</template>

<script setup>
const { $bus } = useNuxtApp()

// data
const config = reactive({
  modules: ['upvote', 'downvote']
})

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

// upvote
const upvote = () => {
  console.log('upvote')
}

const upvoteComment = (data) => {
  console.log(data)
}

// downvote
const downvote = () => {
  console.log('downvote')
}
    
const downvoteComment = (data) => {
  console.log(data)
}

// donate
const donateDialogVisible = ref(false)

const donate = () => {
  donateDialogVisible.value = true
}

const donateLogin = (data) => {
  console.log(data)
  connectDialogVisible.value = true
}

// comment
const reply = () => {
  console.log(message.value)
  message.value = ''
}

const replyComment = (data) => {
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
</script>

<script>
export default {
  data () {
    return {
      data: {
        name: 'hello.bit',
        bio: 'Hello world, hello world',
        avatar: '',
        comments: [{
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
</style>