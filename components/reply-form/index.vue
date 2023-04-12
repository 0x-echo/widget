<template>
  <form-skeleton
    v-bind="$attrs"
    :class="customClass">
    <div
      class="reply-form"
      :class="customClass">
      <el-tooltip
        :disabled="disabledTooltip"
        effect="dark"
        placement="bottom-start">
        <template 
          #content> 
          Avatar is synced from <br />your .bit or .eth records.
        </template>
        
        <chat-avatar
          class="reply-form__avatar"
          :alt="store.screen_name"
          :hash="store.address"
          :src="store.avatar || ''">
        </chat-avatar>
      </el-tooltip>

      <div
        class="reply-form__box">
        <el-input
          class="reply-form__input"
          :disabled="!!store.filter.did && !store.filter.eligible"
          ref="replyInput"
          v-bind="$attrs"
          :autosize="{
            minRows: 1
          }"
          :placeholder="store.filter.did && !store.filter.eligible ? `To write a comment, a subdid of ${store.filter.did} is required.` : placeholder"
          resize="none"
          type="textarea"
          @focus="showToolbarValue = true"
          @keydown.enter="enter">
        </el-input>
        
        <transition
          name="slide-down">
          <div
            class="reply-form__toolbar"
            v-show="showToolbarValue">
            <a 
              class="reply-form__markdown-info"
              href="https://guides.github.com/features/mastering-markdown/"
              target="_blank">
              <i
                class="ri-markdown-fill">
              </i>
              
              <span>
                Styling with Markdown is supported
              </span>
            </a>
            
            <el-button
              class="reply-form__send-button"
              :loading="position === 'comment' ? false : status.onSubmitingTargetComment"
              size="large"
              type="primary"
              @click.stop="$emit('reply')">
              <template
                #loading>
                <chat-loader
                  class="reply-form__send-button-loader">
                </chat-loader>
              </template>
              
              Send
            </el-button>
          </div>
        </transition>
      </div>
    </div>
  </form-skeleton>
</template>

<script setup>
import { ElButton, ElInput, ElTooltip } from 'element-plus'
import FormSkeleton from './skeleton'
import useStore from '~~/store'

const store = useStore()
const avatar = computed(() => store.avatar)
const status = computed(() => store.status)

const props = defineProps({
  customClass: {
    type: String
  },
  disabledTooltip: {
    type: Boolean,
    default: true
  },
  showToolbar: {
    type: Boolean,
    default: false
  },
  isFocused: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Write a comment...'
  },
  position: {
    type: String
  }
})

const emits = defineEmits([
  'reply'
])

const enter = (e) => {
  if (e.metaKey) {
    emits('reply')
  }
}

let showToolbarValue = ref(props.showToolbar)

const replyInput = ref(null)
const focusInput = () => {
  replyInput.value.focus()
}

watch(() => props.isFocused, (val) => {
  if (val) {
    setTimeout(() => {
      focusInput()
    }, 150)
  }
})
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.reply-form {
  display: flex;
  
  &__avatar {
    flex-shrink: 0;
    margin-right: 16px;
  }
  
  &__box {
    flex: 1;
  }
  
  &__input {
    .el-textarea__inner {
      padding: 12px 15px;
      font-size: 14px;
      line-height: 24px;
      background: none;
      color: var(--text-color-primary);
    }
  }
  
  &__toolbar {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: 12px;
    gap: 10px;
  }
  
  &__markdown-info {
    display: flex;
    align-items: center;
    font-size: 12px;
    color: var(--text-color-secondary);
    
    i {
      margin-right: 5px;
      font-size: 14px;
    }
  }
  
  &__send-button {
    width: 120px;
  }
  
  &__send-button-loader {
    margin-right: 10px;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .reply-form {
    &__avatar {
      display: none;
    }
    
    &__toolbar {
      justify-content: flex-end;
    }
    
    &__markdown-info {
      display: none;
    }
    
    &__send-button {
      width: 100px;
      height: 32px;
      font-size: 14px;
      padding-top: 8px;
      padding-bottom: 8px;
    }
  }
}
</style>