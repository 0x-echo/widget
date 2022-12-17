<template>
  <echo-comment-skeleton
    :loading="loading">
    <div
      class="echo-comment">
      <div
        v-if="newPosts > 0"
        class="echo-comment__refresh"
        @click="$emit('refresh-comments')">
        <i
          class="ri-refresh-line echo-comment__refresh-icon">
        </i>
        <span>
          {{ newPosts }} New {{ newPosts > 1 ? 'Comments' : 'Comment' }}
        </span>
      </div>
      
      <div
        class="echo-comment__list">
        <echo-comment-item
          :class="{
            'has-replies': item.replies && item.replies.length
          }"
          v-bind="$attrs"
          v-for="item in data"
          :key="item.id"
          :data="item">
          <echo-comment-reply-list
            v-if="item.replies.length"
            v-bind="$attrs"
            :parent-post="item"
            :total="item.reply_counts"
            :data="item.replies">
          </echo-comment-reply-list>
        </echo-comment-item>
      </div>
      
      <div
        class="echo-comment__bottom"
        v-if="(store.comment.hasMore && !store.comment.isLoadingMore) || store.comment.isLoadingMore">
        <el-button
          v-if="store.comment.hasMore && !store.comment.isLoadingMore"
          class="echo-comment__more-button"
          size="small"
          type="info"
          @click="$emit('load-more-comments')">
          Load More
        </el-button>
        
        <echo-pulse-loader
          v-if="store.comment.isLoadingMore">
        </echo-pulse-loader>
      </div>
    </div>
  </echo-comment-skeleton>
</template>

<script setup>
import { ElButton } from 'element-plus'
import useStore from '~~/store'

const store = useStore();
const newPosts = computed(() => store.new_posts)

const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  loading: {
    type: Boolean
  },
  showMore: {
    type: Boolean,
    default: false
  },
  widgetType: {
    type: String
  }
})

const emits = defineEmits([
  'load-more-comments',
  'refresh-comments',
  'update:modelValue'
])
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.echo-comment {
  position: relative;
  
  &__refresh {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin-bottom: 30px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 500;
    background: rgba(var(--echo-color-danger-rgb), .05);
    color: var(--echo-color-danger);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      background: rgba(var(--echo-color-danger-rgb), .08);
    }
  }
  
  &__refresh-icon {
    display: block;
    margin-right: 8px;
    font-size: 16px;
  }
  
  &__bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 10px 0 28px;
  }
  
  &__more-button {
    .dark & {
      &.active,
      &:hover,
      &:focus,
      &:focus:not(.el-button:hover) {
        color: white;
        background-clip: padding-box;
      }
    }
  }
}
</style>