<template>
  <section-toolbar
    v-bind="$attrs"
    :config="config"
    :loading="loading"
    @like="$emit('like')"
    @tip="$emit('tip')">
  </section-toolbar>
  
  <reply-form
    v-if="config.modules.includes('comment')"
    v-bind="$attrs"
    custom-class="chat-widget__reply"
    :disabled-tooltip="false"
    :loading="loading"
    position="top">
  </reply-form>
  
  <echo-tabs
    v-model="activeTab"
    :loading="loading"
    :tabs="tabs"
    @on-change-tab="$emit('on-change-tab', activeTab)">
    <template
      #header-right>
      <div
        class="template-tabs__sort">
        <echo-sort
          v-if="activeTab === 'comment'"
          v-model="currentSort">
        </echo-sort>
      </div>
    </template>
    
    <echo-tab-pane
      value="comment">
      <empty-placeholder
        v-if="!loading && !data.comments.length">
      </empty-placeholder>
      
      <section-comment
        v-else
        v-bind="$attrs"
        :data="data.comments"
        :loading="loading">
      </section-comment>
    </echo-tab-pane>
    
    <echo-tab-pane
      value="like">
      <empty-placeholder
        v-if="!loading && !data.likes.length"
        button-icon="ri-thumb-up-line"
        button-text="Be the First Liker"
        message=""
        @on-click="$emit('like')">
      </empty-placeholder>
      
      <section-vote
        v-else
        :data="data.likes"
        :loading="loading"
        module="like"
        power-label="Liking Power"
        :power-value="counts.like_power"
        tip="Estimated total value of all liking address">
      </section-vote>
    </echo-tab-pane>
    
    <echo-tab-pane
      value="dislike">
      <empty-placeholder
        v-if="!loading && !data.dislikes.length">
      </empty-placeholder>
      
      <section-vote
        v-else
        :data="data.dislikes"
        :loading="loading"
        module="dislike"
        power-label="Disliking Power"
        :power-value="counts.dislike_power"
        tip="Estimated total value of all disiking address">
      </section-vote>
    </echo-tab-pane>
    
    <echo-tab-pane
      value="tip">
      <empty-placeholder
        v-if="!loading && !data.tips.length"
        button-icon="ri-hand-heart-line"
        button-text="Be the First Supporter"
        message=""
        @on-click="$emit('tip')">
      </empty-placeholder>
      
      <section-tip
        v-else
        :data="data.tips"
        :loading="loading">
      </section-tip>
    </echo-tab-pane>
  </echo-tabs>
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
  'like',
  'on-change-tab',
  'sort-change',
  'tip'
])

const activeTab = ref(props.config.modules[0])

const tabs = computed(() => {
  const list = [{
    icon: 'ri-chat-3-line',
    label: 'Comment',
    plurLabel: 'Comments',
    value: 'comment',
    count: store.counts.comment_counts
  }, {
    icon: 'ri-thumb-up-line',
    label: 'Like',
    plurLabel: 'Likes',
    value: 'like',
    count: store.counts.like_counts
  }, {
    icon: 'ri-thumb-down-line',
    label: 'Dislike',
    plurLabel: 'Dislikes',
    value: 'dislike',
    count: store.counts.dislike_counts
  }, {
    icon: 'ri-money-dollar-circle-line',
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

let currentSort = ref('newest')
watch(currentSort, (val) => {
  emits('sort-change', val)
})
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
@media screen and (max-width: #{$tablet-width - 1px}) {
  .template-tabs {
    &__sort {
      display: none;
    }
  }
}
</style>