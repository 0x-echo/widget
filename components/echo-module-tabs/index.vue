<template>
  <echo-toolbar
    v-bind="$attrs"
    :loading="loading"
    :modules="modules"
    @like="$emit('like')"
    @tip="$emit('tip')">
  </echo-toolbar>
  
  <base-editor
    v-if="modules.includes('comment')"
    v-bind="$attrs"
    custom-class="echo-widget__editor"
    :disabled-tooltip="false"
    :loading="loading"
    :submit-loading="status.onSubmitingComment"
    :user="store">
  </base-editor>
  
  <base-tabs
    v-model="activeTab"
    :loading="loading"
    :tabs="tabs"
    @load-more="$emit('load-more', activeTab)"
    @on-change-tab="$emit('on-change-tab', activeTab)">
    <template
      #header-right>
      <div
        class="echo-module-tabs__sort">
        <base-sort
          v-if="activeTab === 'comment'"
          v-model="currentSort">
        </base-sort>
      </div>
    </template>
    
    <base-tab-pane
      value="comment">
      <base-empty
        v-if="!loading && !data.comments.length"
        :color-theme="store.env.colorTheme">
      </base-empty>
      
      <echo-comment
        v-else
        v-bind="$attrs"
        :data="data.comments"
        :loading="loading">
      </echo-comment>
    </base-tab-pane>
    
    <base-tab-pane
      value="like">
      <base-empty
        v-if="!loading && !data.likes.length"
        button-icon="ri-thumb-up-line"
        button-text="Be the First Liker"
        :color-theme="store.env.colorTheme"
        message=""
        @on-click="$emit('like')">
      </base-empty>
      
      <echo-module-tabs-vote
        v-else
        :data="data.likes"
        :has-more="hasMoreLikes"
        :is-loading-more="isLoadingMoreLikes"
        :loading="loading"
        module="like"
        power-label="Liking Power"
        :power-value="counts.like_power"
        tip="Estimated total value of all liking address">
      </echo-module-tabs-vote>
    </base-tab-pane>
    
    <base-tab-pane
      value="dislike">
      <base-empty
        v-if="!loading && !data.dislikes.length"
        :color-theme="store.env.colorTheme">
      </base-empty>
      
      <echo-module-tabs-vote
        v-else
        :data="data.dislikes"
        :loading="loading"
        module="dislike"
        power-label="Disliking Power"
        :power-value="counts.dislike_power"
        tip="Estimated total value of all disiking address">
      </echo-module-tabs-vote>
    </base-tab-pane>
    
    <base-tab-pane
      value="tip">
      <base-empty
        v-if="!loading && !data.tips.length"
        button-icon="ri-hand-heart-line"
        button-text="Be the First Supporter"
        :color-theme="store.env.colorTheme"
        message=""
        @on-click="$emit('tip')">
      </base-empty>
      
      <echo-module-tabs-tip
        v-else
        :data="data.tips"
        :loading="loading">
      </echo-module-tabs-tip>
    </base-tab-pane>
  </base-tabs>
</template>

<script setup>
import useStore from '~~/store'

const store = useStore()
const counts = computed(() => store.counts)
const status = computed(() => store.status)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  hasMoreLikes: {
    type: Boolean,
    default: false
  },
  isLoadingMoreLikes: {
    type: Boolean,
    default: false
  },
  loading: {
    type: Boolean
  },
  modules: {
    type: Array,
    required: true
  }
})

const emits = defineEmits([
  'like',
  'load-more',
  'on-change-tab',
  'sort-change',
  'tip'
])

const activeTab = ref(props.modules[0])

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
    if (props.modules.includes(item.value)) {
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