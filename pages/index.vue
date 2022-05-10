<template>
  <div
    class="chat-widget">
    <template-tabs
      v-if="config.modules.length > 1"
      :config="config"
      :data="data"
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
    
    <div
      class="chat-widget__container"
      v-if="config.modules.length === 1  && config.modules[0] === 'comment'">
      <reply-form
        custom-class="chat-widget__reply"
        v-model="message"
        @reply="reply">
      </reply-form>
    
      <section-comment
        :data="data.comments"
        @downvote-comment="downvoteComment"
        @refresh-comments="refreshComments"
        @reply-comment="replyComment"
        @upvote-comment="upvoteComment">
      </section-comment>
    </div>
    
    <template-list
      v-if="config.modules.length === 1 && config.modules[0] !== 'comment'"
      :data="data"
      :module="config.modules[0]"
      @downvote="downvote"
      @donate="donate"
      @upvote="upvote">
    </template-list>
    
    <chat-footer>
    </chat-footer>
    
    <dialog-connect
      v-model="connectDialogVisible"
      @connect-wallet="connectWallet">
    </dialog-connect>
    
    <dialog-donate
      v-model="donateDialogVisible">
    </dialog-donate>
  </div>
</template>

<script setup>
import { ref } from 'vue'
const { $bus } = useNuxtApp()

const connectDialogVisible = ref(false)
const donateDialogVisible = ref(false)
let message = ref('')

// connect wallet / disconnect wallet
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
const donate = () => {
  console.log('donate')
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
      },
      config: {
        modules: ['downvote', 'comment', 'upvote']
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