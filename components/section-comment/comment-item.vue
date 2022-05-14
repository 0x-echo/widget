<template>
  <div
    class="comment-item">
    <div
      class="comment-item__avatar"
      @mouseenter="moreMenuVisible = true"
      @mouseleave="moreMenuVisible = false">
      <chat-avatar
        class="comment-item__avatar-image"
        :alt="data.name"
        :src="data.avatar">
      </chat-avatar>
    </div>
    
    <div
      class="comment-item__body">
      <div
        @mouseenter="moreMenuVisible = true"
        @mouseleave="moreMenuVisible = false">
        <div
          class="comment-item__header">
          <div
            class="comment-item__header-content">
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
              
              <icon-copy
                class="comment-item__copy-icon"
                :value="data.name">
              </icon-copy>
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
          
          <el-popover
            :offset="0"
            placement="bottom-end"
            :show-arrow="false"
            trigger="click"
            :width="166"
            @before-leave="moreMenuActive = false"
            @show="moreMenuActive = true">
            <template 
              #reference>
              <el-button
                class="el-button--icon comment-item__more-button"
                :class="{
                  'show': moreMenuVisible || moreMenuActive
                }">
                <i
                  class="ri-more-fill">
                </i>
              </el-button>
            </template>
            
            <template 
              #default>
              <menu-item
                v-for="item in moreMenu"
                :key="item.value"
                :icon="item.icon"
                :label="item.label"
                @click="$emit(item.value, data)">
              </menu-item>
            </template>
          </el-popover>
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
            value="upvote"
            @click="$emit('upvote-comment', data)">
          </comment-action>
          
          <comment-action
            icon="ri-thumb-down-line"
            value="downvote"
            @click="$emit('downvote-comment', data)">
          </comment-action>
          
          <comment-action
            icon="ri-chat-3-line"
            value="reply"
            @click="toggleReplyForm">
          </comment-action>
        </div>
        
        <el-collapse-transition>
          <div
            class="comment-item__reply"
            v-show="showReply">
            <reply-form
              v-model="message"
              is-expanded
              :is-focused="showReply"
              @reply="reply">
            </reply-form>
          </div>
        </el-collapse-transition>
      </div>
      
      <slot>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { ElButton, ElCollapseTransition, ElPopover } from 'element-plus/dist/index.full'
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
  'report',
  'upvote-comment',
  'view-arweave-info'
])

const moreMenuVisible = ref(false)
const moreMenuActive = ref(false)
const moreMenu = [{
  icon: 'ri-information-line',
  label: 'Arweave TX',
  value: 'view-arweave-info'
}, {
  icon: 'ri-alert-line',
  label: 'Report',
  value: 'report'
}]

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
    margin-right: 16px;
  }
  
  &__body {
    flex: 1;
  }
  
  &__header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 6px;
  }
  
  &__header-content {
    flex: 1;
    margin-right: 10px;
  }
  
  &__byline {
    display: inline-flex;
    align-items: center;
    font-size: 15px;
    font-weight: 600;
    
    &:hover {
      .comment-item__copy-icon {
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
    opacity: 0;
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
  
  &__more-button {
    border-color: white;
    opacity: 0;
    transition: all .3s ease;
    
    &.active,
    &:hover,
    &:focus {
      border-color: $bg-color;
      background: $bg-color;
      color: $text-secondary;
    }
    
    &.show {
      opacity: 1;
    }
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
  
  &__reply {
    .reply-form {
      padding-top: 25px;
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .comment-item {
    &.has-replies {
      &::before {
        height: calc(100% - 24px);
        top: 42px;
        left: 14px;
      }
    }
    
    &__avatar {
      margin-right: 10px;
    }
    
    &__more-button {
      opacity: 1;
    }
  }
}
</style>  