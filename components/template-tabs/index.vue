<template>
  <!-- <div
    class="template-tabs"> -->
    <section-toolbar
      v-bind="$attrs"
      :config="config"
      :loading="loading">
    </section-toolbar>
    
    <reply-form
      v-if="config.modules.includes('comment')"
      v-bind="$attrs"
      custom-class="chat-widget__reply"
      :disabled-tooltip="false"
      :loading="loading">
    </reply-form>
    
    <chat-tabs
      v-model="activeTab"
      :loading="loading"
      :tabs="tabs"
      @on-change-tab="$emit('on-change-tab', activeTab)">
      <chat-tab-pane
        value="comment">
        <section-comment
          v-bind="$attrs"
          :data="data.comments"
          :loading="loading">
        </section-comment>
        
        <empty-placeholder
          v-if="!loading && !data.comments.length">
        </empty-placeholder>
      </chat-tab-pane>
      
      <chat-tab-pane
        value="like">
        <section-vote
          :data="data.likes"
          :loading="loading"
          label="Liking Power"
          tip="Estimated Total Value of all Liking Address"
          :value="counts.like_power">
        </section-vote>
        
        <empty-placeholder
          v-if="!loading && !data.likes.length">
        </empty-placeholder>
      </chat-tab-pane>
      
      <chat-tab-pane
        value="dislike">
        <section-vote
          :data="data.dislikes"
          :loading="loading">
        </section-vote>
        
        <empty-placeholder
          v-if="!loading && !data.dislikes.length">
        </empty-placeholder>
      </chat-tab-pane>
      
      <chat-tab-pane
        value="tip">
        <section-tip
          :data="data.tips"
          :loading="loading">
        </section-tip>
        
        <empty-placeholder
          v-if="!loading && !data.tips.length">
        </empty-placeholder>
      </chat-tab-pane>
    </chat-tabs>
  <!-- </div> -->
</template>

<script setup>
import SectionTip from './section-tip'
import SectionVote from './section-vote'
import useStore from '~~/store'

const store = useStore()
const counts = computed(() => store.counts)

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

const emits = defineEmits([
  'on-change-tab'
])

const activeTab = ref(props.config.modules[0])

const tabs = computed(() => {
  const list = [{
    label: 'Comment',
    plurLabel: 'Comments',
    value: 'comment',
    count: store.counts.comment_counts
  }, {
    label: 'Like',
    plurLabel: 'Likes',
    value: 'like',
    count: store.counts.like_counts
  }, {
    label: 'Dislike',
    plurLabel: 'Dislikes',
    value: 'dislike',
    count: store.counts.dislike_counts
  }, {
    label: 'Supporter',
    plurLabel: 'Supporters',
    value: 'tip',
    count: store.counts.uniq_supporter_counts
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