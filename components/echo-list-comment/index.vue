<template>
  <echo-list-comment-skeleton
    :loading="loading">
    <div
      class="echo-comment-list">
      <div
        v-if="newPosts > 0"
        class="echo-comment-list__refresh"
        @click="$emit('refresh-comment-list')">
        <i
          class="ri-refresh-line echo-comment-list__refresh-icon">
        </i>
        <span>
          {{ newPosts }} New {{ newPosts > 1 ? 'Comments' : 'Comment' }}
        </span>
      </div>
      
      <div
        class="echo-comment-list__content">
        <echo-list-comment-item
          :class="{
            'has-replies': item.replies && item.replies.length
          }"
          v-bind="$attrs"
          v-for="item in data"
          :key="item.id"
          :data="item">
          <echo-list-comment-reply-list
            class="echo-comment-list__reply-list"
            v-if="item.replies.length"
            v-bind="$attrs"
            :parent-post="item"
            :total="item.reply_counts"
            :data="item.replies">
          </echo-list-comment-reply-list>
          
          <div
            class="echo-comment-list__content-bottom"
            v-if="store.isLoadingReplyChildren">
            <base-loader-pulse>
            </base-loader-pulse>
          </div>
        </echo-list-comment-item>
      </div>
      
      <div
        class="echo-comment-list__bottom"
        v-if="store.comment.isLoadingMore">
        <base-loader-pulse>
        </base-loader-pulse>
      </div>
    </div>
  </echo-list-comment-skeleton>
</template>

<script setup>
import { ElButton } from 'element-plus'
import useStore from '~~/store'

const store = useStore();
const newPosts = computed(() => store.newPosts)

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
  'refresh-comment-list',
  'update:modelValue'
])
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.echo-comment-list {
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
  
  &__reply-list {
    margin-top: 20px;
  }
  
  &__content-bottom {
    margin-top: 20px;
  }
  
  &__bottom {
    padding: 10px 0 28px;
  }
}
</style>