<template>
  <div
    class="comment-item">
    <div
      class="comment-item__avatar">
      <chat-avatar
        class="comment-item__avatar-image"
        :alt="data.name"
        :size="48"
        :src="data.avatar">
      </chat-avatar>
    </div>
    
    <div
      class="comment-item__body">
      <div
        class="comment-item__header">
        <div
          class="comment-item__byline">
          <span
            class="comment-item__author"
            :title="data.name">
            {{ data.name }}
          </span>
          
          <!-- <chat-tag
            class="comment-item__tag">
            Author
          </chat-tag> -->
          
          <i
            class="ri-file-copy-line comment-item__copy-icon">
          </i>
        </div>
          
        <div
          class="comment-item__meta">
          <template
            v-if="data.reply_to">
            <span>
              Replying to 
              <span
                class="comment-item__meta-reply">
                @{{ data.reply_to }}
              </span>
            </span>
            
            <span
              class="comment-item__meta-divider">
              ·
            </span>
          </template>
          
          <span>
            {{ $formatDate(data.created_at) }}
          </span>
        </div>
      </div>
      
      <div
        class="comment-item__content">
        {{ data.content }}
      </div>
      
      <div
        class="comment-item__control-bar">
        <comment-action
          active
          :count="1"
          icon="ri-thumb-up-line"
          @click="$emit('upvote-comment', data)">
        </comment-action>
        
        <comment-action
          icon="ri-thumb-down-line"
          @click="$emit('downvote-comment', data)">
        </comment-action>
        
        <comment-action
          icon="ri-reply-line"
          @click="toggleReplyForm">
        </comment-action>
      </div>
      
      <reply-form
        v-if="showReply"
        v-model="message"
        @reply="reply">
      </reply-form>
      
      <slot>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import CommentAction from './comment-action'
const { $bus } = useNuxtApp()

onBeforeUnmount(() => {
  $bus.off('reset-reply-comment')
})

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const emits = defineEmits([
  'downvote-comment',
  'reply-comment',
  'upvote-comment'
])

const showReply = ref(false)
let message = ref('')

const toggleReplyForm = () => {
  showReply.value = !showReply.value
  if (!showReply.value) {
    message.value = ''
  }
}

const reply = () => {
  emits('reply-comment', {
    message: message.value,
    data: props.data
  })
}

$bus.on('reset-reply-comment', (data) => {
  if (props.data.id === data.id) {
    message.value = ''
  }
})
</script>

<style lang="scss">
.comment-item {
  position: relative;
  display: flex;
  
  &.has-replies {
    &::before {
      content: '';
      position: absolute;
      top: 60px;
      left: 24px;
      width: 1px;
      height: calc(100% - 42px);
      background: $bg-color;
    }
  }
  
  & + & {
    margin-top: 30px;
  }
  
  &__avatar {
    flex-shrink: 0;
    
    & + .comment-item__body {
      margin-left: 16px;
    }
  }
  
  &__body {
    flex: 1;
  }
  
  &__header {
    margin-bottom: 6px;
  }
  
  &__byline {
    display: flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
  }
  
  &__author {
    &:hover {
      & + .comment-item__copy-icon {
        opacity: 1;
      }
    }
  }
  
  &__tag {
    margin-left: 8px;
  }
  
  &__copy-icon {
    margin-left: 6px;
    font-size: 12px;
    color: $text-muted;
    opacity: 0;
    cursor: pointer;
    
    &:hover {
      color: $primary;
    }
  }
  
  &__meta {
    font-size: 12px;
    color: $text-muted;
    margin-top: 2px;
  }
  
  &__meta-reply {
    color: $text-secondary;
  }
  
  &__meta-divider {
    margin: 0 5px;
  }
  
  &__content {
    font-size: 14px;
    line-height: 24px;
    color: $text-primary;
  }
  
  &__control-bar {
    display: flex;
    align-items: center;
    margin-top: 6px;
  }
}
</style>  