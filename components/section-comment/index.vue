<template>
  <comment-skeleton
    :loading="loading">
    <div
      class="section-comment">
      <div
        v-if="newPosts > 0"
        class="section-comment__refresh"
        @click="$emit('refresh-comments')">
        <i
          class="ri-refresh-line section-comment__refresh-icon">
        </i>
        <span>
          {{ newPosts }} New {{ newPosts > 1 ? 'Comments' : 'Comment' }}
        </span>
      </div>
      
      <comment-list
        v-bind="$attrs">
      </comment-list>
      
      <div
        class="section-comment__bottom"
        v-if="store.comment.isLoadingMore">
        <pulse-loader
          v-if="store.comment.isLoadingMore">
        </pulse-loader>
      </div>
    </div>
  </comment-skeleton>
</template>

<script setup>
import { ElButton } from 'element-plus'
import CommentList from './comment-list'
import CommentSkeleton from './skeleton'
import useStore from '~~/store'

const store = useStore();
const newPosts = computed(() => store.new_posts)

const props = defineProps({
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
.section-comment {
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
    background: rgba(var(--color-danger-rgb), .05);
    color: var(--color-danger);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      background: rgba(var(--color-danger-rgb), .08);
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