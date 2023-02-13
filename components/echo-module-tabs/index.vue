<template>
  <echo-toolbar
    v-bind="$attrs"
    :loading="loading"
    :modules="modules"
    @like="onLike"
    @tip="$emit('tip')">
  </echo-toolbar>
  
  <base-editor
    v-if="modules.includes('comment')"
    v-bind="$attrs"
    custom-class="echo-widget__editor"
    :disabled-tooltip="false"
    :loading="loading"
    :submit-loading="status.onSubmitingComment"
    :user="store"
    @submit="$emit('comment')">
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
        :data="data.comments.filter(item => { return item.is_deleted === false })"
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
        @on-click="onLike">
      </base-empty>
      
      <echo-reaction-list
        v-else
        :data="data.likes"
        :is-loading-more="store.like.isLoadingMore"
        :loading="loading"
        module="like"
        power-label="Liking Power"
        :power-value="store.like.power"
        tip="Estimated total value of all liking address">
      </echo-reaction-list>
    </base-tab-pane>
    
    <base-tab-pane
      value="dislike">
      <base-empty
        v-if="!loading && !data.dislikes.length"
        :color-theme="store.env.colorTheme">
      </base-empty>
      
      <echo-reaction-list
        v-else
        :data="data.dislikes"
        :is-loading-more="store.dislike.isLoadingMore"
        :loading="loading"
        module="dislike"
        power-label="Disliking Power"
        :power-value="store.dislike.power"
        tip="Estimated total value of all disiking address">
      </echo-reaction-list>
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
      
      <echo-reaction-list
        v-else
        :data="data.tips"
        :loading="loading">
      </echo-reaction-list>
    </base-tab-pane>
  </base-tabs>
</template>

<script setup>
import useStore from '~~/store'

const store = useStore()
const status = computed(() => store.status)

const props = defineProps({
  data: {
    type: Object,
    required: true
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
  'comment',
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
    count: store.comment.counts
  }, {
    icon: 'ri-thumb-up-line',
    label: 'Like',
    plurLabel: 'Likes',
    value: 'like',
    count: store.like.counts
  }, {
    icon: 'ri-thumb-down-line',
    label: 'Dislike',
    plurLabel: 'Dislikes',
    value: 'dislike',
    count: store.dislike.counts
  }, {
    icon: 'ri-money-dollar-circle-line',
    label: 'Supporter',
    plurLabel: 'Supporters',
    value: 'tip',
    count: store.tip.uniqCounts
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

const onLike = (data) => {
  emits('like', data)
}
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