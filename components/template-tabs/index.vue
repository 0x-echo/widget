<template>
  <div
    class="chat-widget__container template-tabs">
    <section-toolbar
      v-bind="$attrs"
      :config="toolbarConfig">
    </section-toolbar>
    
    <reply-form
      custom-class="chat-widget__reply"
      v-bind="$attrs">
    </reply-form>
    
    <chat-tabs
      v-if="config.modules.length > 1"
      v-model="activeTab"
      :tabs="tabs">
    </chat-tabs>
    
    <section-comment
      v-show="activeTab === 'comment'"
      v-bind="$attrs"
      :data="data.comments">
    </section-comment>
    
    <section-vote
      v-show="activeTab === 'upvote'"
      :data="data.upvotes"
      value="1.22B">
    </section-vote>
    
    <section-vote
      v-show="activeTab === 'downvote'"
      :data="data.downvotes"
      value="1.22B">
    </section-vote>
    
    <section-donate
      v-show="activeTab === 'donation'"
      :data="data.donations"
      value="1.22B">
    </section-donate>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import SectionDonate from './section-donate'
import SectionVote from './section-vote'

const props = defineProps({
  config: {
    type: Object,
    required: true
  },
  data: {
    type: Object,
    required: true
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
    label: 'Donations',
    value: 'donation',
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