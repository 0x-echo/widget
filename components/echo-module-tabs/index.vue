<template>
  <echo-toolbar
    v-bind="$attrs"
    :config="config"
    :loading="loading"
    @like="$emit('like')"
    @tip="$emit('tip')">
  </echo-toolbar>
  
  <echo-editor
    v-if="config.modules.includes('comment')"
    v-bind="$attrs"
    custom-class="echo-widget__editor"
    :disabled-tooltip="false"
    :loading="loading"
    position="top">
  </echo-editor>
  
  <echo-tabs
    v-model="activeTab"
    :loading="loading"
    :tabs="tabs"
    @on-change-tab="$emit('on-change-tab', activeTab)">
    <template
      #header-right>
      <div
        class="echo-module-tabs__sort">
        <echo-sort
          v-if="activeTab === 'comment'"
          v-model="currentSort">
        </echo-sort>
      </div>
    </template>
    
    <echo-tab-pane
      value="comment">
      <echo-empty
        v-if="!loading && !data.comments.length">
      </echo-empty>
      
      <echo-comment
        v-else
        v-bind="$attrs"
        :data="data.comments"
        :loading="loading">
      </echo-comment>
    </echo-tab-pane>
    
    <echo-tab-pane
      value="like">
      <echo-empty
        v-if="!loading && !data.likes.length"
        button-icon="ri-thumb-up-line"
        button-text="Be the First Liker"
        message=""
        @on-click="$emit('like')">
      </echo-empty>
      
      <echo-module-tabs-vote
        v-else
        :data="data.likes"
        :loading="loading"
        module="like"
        power-label="Liking Power"
        :power-value="counts.like_power"
        tip="Estimated total value of all liking address">
      </echo-module-tabs-vote>
    </echo-tab-pane>
    
    <echo-tab-pane
      value="dislike">
      <echo-empty
        v-if="!loading && !data.dislikes.length">
      </echo-empty>
      
      <echo-module-tabs-vote
        v-else
        :data="data.dislikes"
        :loading="loading"
        module="dislike"
        power-label="Disliking Power"
        :power-value="counts.dislike_power"
        tip="Estimated total value of all disiking address">
      </echo-module-tabs-vote>
    </echo-tab-pane>
    
    <echo-tab-pane
      value="tip">
      <echo-empty
        v-if="!loading && !data.tips.length"
        button-icon="ri-hand-heart-line"
        button-text="Be the First Supporter"
        message=""
        @on-click="$emit('tip')">
      </echo-empty>
      
      <echo-module-tabs-tip
        v-else
        :data="data.tips"
        :loading="loading">
      </echo-module-tabs-tip>
    </echo-tab-pane>
  </echo-tabs>
</template>

<script setup>
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
  .echo-module-tabs {
    &__sort {
      display: none;
    }
  }
}
</style>