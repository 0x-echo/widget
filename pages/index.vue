<template>
  <div
    class="chat-widget">
    <section-toolbar>
    </section-toolbar>
    
    <reply-form
      class="chat-widget__reply">
    </reply-form>
    
    <chat-tabs
      v-model="activeTab"
      :tabs="tabs">
    </chat-tabs>
    
    <section-comment
      v-show="activeTab === 'comments'"
      :data="comments">
    </section-comment>
    
    <section-vote
      v-show="activeTab === 'upvotes'"
      :data="upvotes"
      value="1.22B">
    </section-vote>
    
    <section-vote
      v-show="activeTab === 'downvotes'"
      :data="downvotes"
      value="1.22B">
    </section-vote>
    
    <section-donate
      v-show="activeTab === 'donations'"
      :data="donations"
      value="1.22B">
    </section-donate>
    
    <chat-footer>
    </chat-footer>
  </div>
</template>

<script>
export default {
  data () {
    return {
      activeTab: 'comments',
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
      tabs: [{
        label: 'Comments',
        value: 'comments'
      }, {
        label: 'Upvotes',
        value: 'upvotes'
      }, {
        label: 'Downvotes',
        value: 'downvotes'
      }, {
        label: 'Donations',
        value: 'donations'
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
</script>

<style lang="scss">
.chat-widget {
  width: 100%;
  max-width: 800px;
  padding: 20px;
  
  &__reply {
    margin-bottom: 30px;
  }
}
</style>