<template>
  <div
    class="echo-comment-item"
    :id="`_${data.id}`">
    <div
      class="echo-comment-item__avatar"
      @mouseenter="moreMenuVisible = true"
      @mouseleave="moreMenuVisible = false">
      <base-avatar
        class="echo-comment-item__avatar-image"
        :alt="data.author.screen_name"
        :hash="data.author.address"
        :size="avatarSize"
        :src="data.author.avatar || ''">
      </base-avatar>
    </div>
    
    <div
      class="echo-comment-item__body">
      <div
        @mouseenter="moreMenuVisible = true"
        @mouseleave="moreMenuVisible = false">
        <div
          class="echo-comment-item__header">
          <div
            class="echo-comment-item__header-content">
            <div
              class="echo-comment-item__byline">
              <span
                class="echo-comment-item__author ellipsis"
                :title="data.author.screen_name">
                {{ $formatScreenName(data.author.screen_name) }}
              </span>
              
              <base-tag
                v-if="data.is_author"
                class="echo-comment-item__tag">
                Author
              </base-tag>
            </div>
              
            <div
              class="echo-comment-item__meta">
              <timeago 
                :datetime="data.posted_at" 
                :title="$formatDate(data.posted_at)" />
               
              <template
                v-if="data.from_app">
                <span>
                  · 
                </span>
                
                <a 
                  :href="data.from_uri"
                  :title="data.from_app"
                  target="_blank">
                  {{ data.from_app }}
                </a>
              </template> 
            </div>
          </div>
          
          <el-popover
            ref="commentMenuRef"
            placement="bottom-end"
            trigger="click"
            :width="190"
            @before-leave="moreMenuActive = false"
            @show="moreMenuActive = true">
            <template 
              #reference>
              <el-button
                class="el-button--icon echo-comment-item__menu-button"
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
              <base-menu-item
                v-for="item in moreMenu"
                :key="item.value"
                :danger="item.danger"
                :icon="item.icon"
                :is-link="item.isLink"
                :label="item.label"
                :url="item.url"
                @on-click="onClickMenu(item.value)">
              </base-menu-item>
            </template>
          </el-popover>
        </div>
      
        <div
          class="echo-comment-item__content"
          :class="{
            'collapsed': hasMoreButton && collapsed
          }"
          ref="commentContentRef"
          v-html="commentContent">
        </div>
        
        <div
          class="echo-comment-item__content-more"
          v-if="hasMoreButton">
          <el-button
            text
            type="primary"
            @click="toggleContent">
            {{ collapsed ? 'Show more' : 'Show less' }}
          </el-button>
        </div>
        
        <div
          class="echo-comment-item__control-bar">
          <echo-comment-toolbar
            :active="data.has_liked && hasLogined"
            :count="data.like_counts"
            icon="ri-thumb-up-line"
            value="like"
            @click="$emit('like-comment', data)">
          </echo-comment-toolbar>
          
          <echo-comment-toolbar
            v-if="store.widgetConfig.show_comment_dislike"
            :active="data.has_disliked && hasLogined"
            :count="data.dislike_counts"
            icon="ri-thumb-down-line"
            value="dislike"
            @click="$emit('dislike-comment', data)">
          </echo-comment-toolbar>
          
          <echo-comment-toolbar
            icon="ri-chat-3-line"
            value="reply"
            @click="toggleReplyForm">
          </echo-comment-toolbar>
        </div>
        
        <el-collapse-transition>
          <div
            class="echo-comment-item__reply"
            v-show="showReply">
            <base-editor
              v-model="message"
              :autofocus="showReply"
              :loading="false"
              :placeholder="`Reply to ${ $formatScreenName(data.author.screen_name) }`"
              show-toolbar-on-init
              :submit-loading="status.onSubmitingReply"
              :user="store"
              @reply="reply">
            </base-editor>
          </div>
        </el-collapse-transition>
      </div>
      
      <slot>
      </slot>
    </div>
  </div>
</template>

<script setup>
import { ElButton, ElCollapseTransition, ElMessage, ElPopover } from 'element-plus'
const { $bus, $formatAddress, $formatScreenName } = useNuxtApp()
import { Timeago } from 'vue2-timeago'
import { parseContent } from '../../libs/content-parser'
import useStore from '~~/store'
import { toClipboard } from '@soerenmartius/vue3-clipboard'
import jump from 'jump.js'

const store = useStore()
const status = computed(() => store.status)
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
  'like-comment',
  'view-arweave-info'
])

const commentContentRef = ref(null)
let hasMoreButton = ref(false)
let collapsed = ref(true)

onMounted(() => {
  if (commentContentRef.value.clientHeight > 105) {
    hasMoreButton.value = true
  }
})

const moreMenuVisible = ref(false)
const moreMenuActive = ref(false)
const moreMenu = computed(() => {
  const menus = []
  if (props.data.ar_url) {
    menus.push({
      icon: 'ri-information-line',
      label: 'Arweave TX',
      url: props.data.ar_url,
      isLink: true,
      value: 'view-arweave-info'
    })
  } else {
    menus.push({
      icon: 'ri-send-plane-line',
      label: 'Arweave',
      value: 'view-arweave-info'
    })
  }
  if (store.hasLogined && !store.isMe(props.data.created_by)) {
    menus.push({
      icon: 'ri-alert-line',
      label: 'Report',
      value: 'report'
    })
  }
  
  menus.push({
    icon: 'ri-file-copy-line',
    label: 'Copy Wallet Address',
    value: 'copy-wallet-address'
  })

  if (props.data.can_delete) {
    menus.push({
      danger: true,
      icon: 'ri-close-circle-line',
      label: 'Delete',
      value: 'delete-comment',
      permission: 'can_delete'
    })
  }
  return menus
})


const commentMenuRef = ref(null)
const onClickMenu = async (value) => {
  if (value === 'copy-wallet-address') {
    await toClipboard($formatAddress(props.data.author.address))
    ElMessage.success({
      message: 'Copied!'
    })
  } else {
    emits(value, props.data)
  }
  commentMenuRef.value.hide()
}

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
    return `<span class="echo-comment-item__reply-to">@${$formatScreenName(props.data.replied_to.screen_name)}</span> ` + parseContent(props.data.content) 
  } else {
    return parseContent(props.data.content) 
  }
})

const toggleContent = () => {
  collapsed.value = !collapsed.value
  if (collapsed.value) {
    jump(`#_${props.data.id}`, {
      offset: 0
    })
  }
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.echo-comment-item {
  position: relative;
  display: flex;
  margin-bottom: 20px;
  
  &.has-replies {
    &::before {
      content: '';
      position: absolute;
      top: 60px;
      left: 24px;
      width: 1px;
      height: calc(100% - 42px);
      background: var(--echo-bg-color);
    }
  }
  
  &__avatar {
    flex-shrink: 0;
    margin-right: 16px;
    
    img {
      background: white;
    }
  }
  
  &__body {
    flex: 1;
    min-width: 0;
  }
  
  &__header {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 8px;
  }
  
  &__header-content {
    flex: 1;
    min-width: 0;
    margin-right: 10px;
  }
  
  &__byline {
    display: flex;
    align-items: center;
    
    &:hover {
      .echo-comment-item__copy-icon {
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
  
  &__meta {
    margin-top: 2px;
    flex-shrink: 0;
    font-size: 12px;
    
    &,
    a {
      color: var(--echo-text-color-muted);
    }
    
    a {
      &:hover {
        color: var(--echo-color-primary);
      }
    }
  }
  
  &__reply-to {
    color: var(--echo-color-primary);

    & + p {
      display: inline;
    }
  }
  
  &__menu-button {
    border-color: var(--echo-fill-color-blank);
    font-size: 14px;
    opacity: 0;
    transition: all .3s ease;
    
    &.active,
    &:hover,
    &:focus,
    &:focus:not(.el-button:hover) {
      border-color: var(--echo-bg-color);
      background: var(--echo-bg-color);
      color: var(--echo-text-color-secondary);
    }
    
    .dark & {
      border-color: transparent;
      background: transparent;
      
      &.active,
      &:hover,
      &:focus,
      &:focus:not(.el-button:hover) {
        color: white;
        border-color: var(--echo-bg-color);
        background: var(--echo-bg-color);
        background-clip: padding-box;
      }
    }
    
    &.show {
      opacity: 1;
    }
  }
  
  &__content {
    font-size: 14px;
    line-height: 1.625;
    color: var(--echo-text-color-primary);
    
    &.collapsed {
      max-height: 105px;
      overflow: hidden;
      mask-image: linear-gradient(var(--echo-theme-bg-color) 50%, transparent);
    }
    
    > :first-child {
      margin-top: 0;
    }
    
    > :last-child {
      margin-bottom: 0;
    }
    
    h1,
    h2,
    h3,
    h4,
    h5,
    h6,
    hr,
    p,
    blockquote,
    pre,
    ul,
    ol {
      margin-bottom: 16px;
    }
    
    h1 {
      font-size: 28px;
    }
    
    h2 {
      font-size: 21px;
    }
    
    h3 {
      font-size: 18px;
    }
    
    h4,
    h5,
    h6 {
      font-size: 14px;
    }
    
    h1,
    h2,
    h3,
    h4,
    h5,
    h6 {
      margin-top: 24px;
    }
    
    hr {
      border: 0; 
      border-top: 1px solid var(--echo-bg-color);
    }
    
    a {
      text-decoration: underline;
    }
    ul li {
      list-style: disc;
      margin-left: 15px;
    }
    ol li {
      list-style: number;
      margin-left: 15px;
    }
    img {
      max-width: 200px;
    }
    
    p { 
      code {
        padding: 3px 5px;
        border-radius: var(--echo-border-radius-small);
        background: var(--echo-bg-color);
      }
      
      + p {
        margin-top: 0;
      }
    }

    blockquote {
      padding: 0 14px;
      border-left: 3px solid var(--echo-bg-color);
      
      > :first-child {
        margin-top: 0;
      }
      
      > :last-child {
        margin-bottom: 0;
      }
    }

    code {
      font-size: 12px;
      font-family: ui-monospace,SFMono-Regular,SF Mono,Menlo,Consolas,Liberation Mono,monospace;
    }
    
    pre {
      padding: 12px 15px;
      border-radius: var(--echo-border-radius);
      background: var(--echo-bg-color);
    }
    table {
      width: 100%;
      font-size: 14px;
      text-align: left;
    }
    
    th,
    td {
      padding: 10px 15px;
      border-bottom: 1px solid var(--echo-bg-color);
      min-width: 120px;
    }
    
    th:first-of-type,
    td:first-of-type {
      padding-left: 0;
    }
    
    th:last-of-type,
    td:last-of-type {
      padding-right: 0;
    }
    
    td:nth-child(3) {
      max-width: 250px;
      min-width: 200px;
    }
    
    th {
      font-weight: 600;
    }
  }
  
  &__content-more {
    margin-top: 5px;
  }
  
  &__control-bar {
    display: flex;
    align-items: center;
    margin: 6px 0 0 -8px;
  }
  
  &__reply {
    padding-top: 15px;
  }
  
  .echo-comment-reply-list & {
    .echo-comment-item__header {
      margin-bottom: 2px;;
    }
    
    .echo-comment-item__header-content {
      display: flex;
      align-items: center;
    }
    
    .echo-comment-item__meta {
      margin: 0 0 0 10px;
    }
  }
}
@media screen and (max-width: #{$tablet-width - 1px}) {
  .echo-comment-item {
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
    
    &__menu-button {
      opacity: 1;
    }
    
    &__reply {
      .base-editor__input {
        .el-textarea__inner {
          padding: 8px 12px;
        }
      }
    }
  }
}
</style>  