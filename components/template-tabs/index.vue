<template>
  <div
    class="chat-widget__container template-tabs">
    <section-toolbar
      v-bind="$attrs"
      :config="config"
      :loading="loading">
    </section-toolbar>
    
    <reply-form
      v-if="config.modules.includes('comment')"
      v-bind="$attrs"
      custom-class="chat-widget__reply"
      :loading="loading">
    </reply-form>
    
    <chat-tabs
      v-if="config.modules.length > 1"
      v-model="activeTab"
      :loading="loading"
      :tabs="tabs">
      <chat-tab-pane
        value="comment">
        <section-comment
          v-bind="$attrs"
          :data="data.comments"
          :loading="loading">
        </section-comment>
      </chat-tab-pane>
      
      <chat-tab-pane
        value="upvote">
        <section-vote
          :data="data.upvotes"
          :loading="loading"
          value="1.22B">
        </section-vote>
      </chat-tab-pane>
      
      <chat-tab-pane
        value="downvote">
        <section-vote
          :data="data.downvotes"
          :loading="loading"
          value="1.22B">
        </section-vote>
      </chat-tab-pane>
      
      <chat-tab-pane
        value="donation">
        <section-tip
          :data="data.donations"
          :loading="loading"
          value="1.22B">
        </section-tip>
      </chat-tab-pane>
    </chat-tabs>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SectionTip from './section-tip'
import SectionVote from './section-vote'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    required: true
  },
  loading: {
    type: Boolean
  }
})

const activeTab = ref(props.config.modules[0])

const tabs = computed(() => {
  const list = [{
    label: 'Comments',
    value: 'comment',
    count: 0
  }, {
    label: 'Upvotes',
    value: 'upvote',
    count: 1
  }, {
    label: 'Downvotes',
    value: 'downvote',
    count: 1
  }, {
    label: 'Tips',
    value: 'tip',
    count: 1
  }]
  
  let newList = []
  list.forEach(item => {
    if (props.config.modules.includes(item.value)) {
      newList.push(item)
    }
  })
  
  return newList
})
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
</style>