<template>
  <form-skeleton
    v-bind="$attrs"
    :class="customClass">
    <div
      class="reply-form"
      :class="customClass">
      <chat-avatar
        class="reply-form__avatar"
        :alt="store.screen_name || store.dotbit || store.ens"
        :src="avatar || user.avatar">
      </chat-avatar>
      
      <div
        class="reply-form__box">
        <el-input
          class="reply-form__input"
          ref="replyInput"
          v-bind="$attrs"
          autosize
          :placeholder="placeholder"
          resize="none"
          :rows="1"
          type="textarea"
          @focus="showToolbarValue = true"
          @keydown.enter="enter">
        </el-input>
        
        <transition
          name="slide-down">
          <div
            class="reply-form__toolbar"
            v-show="showToolbarValue">
            <el-button
              class="reply-form__send-button"
              size="large"
              type="primary"
              @click.stop="$emit('reply')">
              <template
                #loading>
                <div
                  class="reply-form__send-button-loader">
                </div>
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
import { ElButton, ElInput } from 'element-plus'
import FormSkeleton from './skeleton'
import useStore from '~~/store'

const store = useStore()
const avatar = computed(() => store.avatar)

const props = defineProps({
  customClass: {
    type: String
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
    default: 'Type something...'
  },
  user: {
    type: Object,
    default () {
      return {}
    }
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
    margin-top: 12px;
    text-align: right;
  }
  
  &__send-button {
    width: 120px;
  }
  
  &__send-button-loader {
    width: 15px;
    height: 15px;
    margin-right: 10px;
    border-radius: 50%;
    border: 2px solid #fff;
    clip-path: inset(0 0 50% 0);
    transform: rotate(0);
    animation: spin .6s linear infinite;
  }
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .reply-form {
    &__avatar {
      display: none;
    }
  }
}
</style>