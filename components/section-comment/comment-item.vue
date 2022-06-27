<template>
  <div
    class="comment-item">
    <div
      class="comment-item__avatar"
      @mouseenter="moreMenuVisible = true"
      @mouseleave="moreMenuVisible = false">
      <chat-avatar
        class="comment-item__avatar-image"
        :alt="data.author.screen_name"
        :hash="data.author.address"
        :size="avatarSize"
        :src="data.author.avatar || ''">
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
                class="comment-item__author ellipsis"
                :title="data.author.screen_name">
                {{ $formatScreenName(data.author.screen_name) }}
              </span>
              
              <chat-tag
                v-if="data.is_author"
                class="comment-item__tag">
                Author
              </chat-tag>
              
              <!-- <icon-copy
                class="comment-item__copy-icon"
                :value="$formatAddress(data.author.address)"
                title="copy address">
              </icon-copy> -->
            </div>
              
            <div
              class="comment-item__date">
              <timeago 
                :datetime="data.posted_at" 
                :title="$formatDate(data.posted_at)" />
            </div>
          </div>
          
          <el-popover
            placement="bottom-end"
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
                }"
                size="small">
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
                :danger="item.danger"
                :icon="item.icon"
                :is-link="item.isLink"
                :label="item.label"
                :url="item.url + data.ar_tx_id"
                @on-click="$emit(item.value, data)">
              </menu-item>
            </template>
          </el-popover>
        </div>
            
        <div
          class="comment-item__content" 
          v-html="commentContent">
        </div>
        
        <div
          class="comment-item__control-bar">
          <comment-action
            :active="data.has_liked && hasLogined"
            :count="data.like_counts"
            icon="ri-thumb-up-line"
            value="like"
            @click="$emit('like-comment', data)">
          </comment-action>
          
          <comment-action
            v-if="store.widgetConfig.show_comment_dislike"
            :active="data.has_disliked && hasLogined"
            :count="data.dislike_counts"
            icon="ri-thumb-down-line"
            value="dislike"
            @click="$emit('dislike-comment', data)">
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
              :is-focused="showReply"
              :loading="false"
              :placeholder="`Reply to ${ $formatScreenName(data.author.screen_name) }`"
              position="comment"
              show-toolbar
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
import { ElButton, ElCollapseTransition, ElPopover } from 'element-plus'
import CommentAction from './comment-action'
const { $bus, $formatScreenName } = useNuxtApp()
import { Timeago } from 'vue2-timeago'
import { parseContent } from '../../libs/content-parser'
import useStore from '~~/store'

const store = useStore()
const hasLogined = computed(() => store.hasLogined)

onBeforeUnmount(() => {
  $bus.off('reset-reply-comment')
})

const props = defineProps({
  avatarSize: {
    type: [Number, String],
    default: 'default'
  },
  data: {
    type: Object,
    required: true
  }
})

const emits = defineEmits([
  'delete-comment',
  'dislike-comment',
  'reply-comment',
  'report',
  'like-comment'
])

const moreMenuVisible = ref(false)
const moreMenuActive = ref(false)
const moreMenu = computed(() => {
  // const menus = [{
  //   icon: 'ri-information-line',
  //   isLink: true,
  //   label: 'Arweave TX',
  //   url: 'https://viewblock.io/arweave/tx/',
  //   value: 'view-arweave-info'
  // }]

  const menus = [{
    icon: 'ri-information-line',
    label: 'Arweave TX',
    url: 'https://viewblock.io/arweave/tx/',
    value: 'view-arweave-info'
  }]

  if (store.hasLogined && !store.isMe(props.data.created_by)) {
    menus.push({
      icon: 'ri-alert-line',
      label: 'Report',
      value: 'report'
    })
  }

  // @later
  // if (props.data.can_delete) {
  //   menus.push({
  //     danger: true,
  //     icon: 'ri-close-circle-line',
  //     label: 'Delete',
  //     value: 'delete-comment',
  //     permission: 'can_delete'
  //   })
  // }
  return menus
})

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
    showReply.value = false
  }
})

const commentContent = computed(() => {
  if (props.data.replied_to) {
    return `<span class="comment-item__meta-reply">@${$formatScreenName(props.data.replied_to.screen_name)}</span> ` + parseContent(props.data.content) 
  } else {
    return parseContent(props.data.content) 
  }
})
</script>

<script>
export default {
  inheritAttrs: false
}
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
      background: var(--bg-color);
    }
  }
  
  & + & {
    margin-top: 20px;
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
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 4px;
  }
  
  &__header-content {
    flex: 1;
    margin-right: 10px;
  }
  
  &__byline {
    display: inline-flex;
    align-items: center;
    min-width: 0;
    
    &:hover {
      .comment-item__copy-icon {
        opacity: 1;
      }
    }
  }
  
  &__author {
    font-size: 14px;
    font-weight: 500;
  }
  
  &__tag {
    margin-left: 8px;
  }
  
  &__copy-icon {
    margin-left: 6px;
    font-size: 12px;
    opacity: 0;
  }
  
  &__date {
    flex-shrink: 0;
    font-size: 12px;
    color: var(--text-color-muted);
  }
  
  &__meta-reply {
    color: var(--color-primary);
  }
  
  &__more-button {
    border-color: var(--fill-color-blank);
    font-size: 14px;
    opacity: 0;
    transition: all .3s ease;
    
    &.active,
    &:hover,
    &:focus,
    &:focus:not(.el-button:hover) {
      border-color: var(--bg-color);
      background: var(--bg-color);
      color: var(--text-color-secondary);
    }
    
    .dark & {
      border-color: transparent;
      background: transparent;
      
      &.active,
      &:hover,
      &:focus,
      &:focus:not(.el-button:hover) {
        color: white;
        border-color: var(--bg-color);
        background: var(--bg-color);
        background-clip: padding-box;
      }
    }
    
    &.show {
      opacity: 1;
    }
  }
  
  &__content {
    font-size: 14px;
    line-height: 24px;
    color: var(--text-color-primary);
    
    a {
      text-decoration: underline;
    }
  }
  
  &__control-bar {
    display: flex;
    align-items: center;
    margin: 5px 0 0 -8px;
  }
  
  &__reply {
    padding-top: 15px;
  }
  
  .reply-list & {
    .comment-item__header {
      margin-bottom: 2px;;
    }
    
    .comment-item__header-content {
      display: flex;
      align-items: center;
    }
    
    .comment-item__date {
      margin: 0 0 0 10px;
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
    
    &__reply {
      .reply-form__input {
        .el-textarea__inner {
          padding: 8px 12px;
        }
      }
    }
  }
}
</style>  