<template>
  <form-skeleton
    v-bind="$attrs"
    :class="customClass">
    <div
      class="reply-form"
      :class="customClass">
      <chat-avatar
        class="reply-form__avatar"
        :alt="user.name || 'Avatar'"
        :src="user.avatar">
      </chat-avatar>
      
      <div
        class="reply-form__box"
        :class="{
          'is-expanded': isExpandedValue
        }">
        <el-input
          class="reply-form__input"
          ref="replyInput"
          v-bind="$attrs"
          placeholder="Type something..."
          resize="none"
          :rows="isExpandedValue ? 2 : 1"
          type="textarea"
          @focus="isExpandedValue = true"
          @keyup.enter="$emit('reply')">
        </el-input>
        
        <transition
          name="slide-down">
          <div
            class="reply-form__toolbar"
            v-show="isExpandedValue"
            @click="focusInput">
            <el-button
              class="reply-form__send-button"
              :disabled="!$attrs.modelValue"
              type="primary"
              @click.stop="$emit('reply')">
              Send
            </el-button>
          </div>
        </transition>
      </div>
    </div>
  </form-skeleton>
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElButton, ElInput } from 'element-plus/dist/index.full'
import FormSkeleton from './skeleton'

const props = defineProps({
  customClass: {
    type: String
  },
  isExpanded: {
    type: Boolean,
    default: false
  },
  isFocused: {
    type: Boolean,
    default: false
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

let isExpandedValue = ref(props.isExpanded)

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
    height: 48px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    background: var(--fill-color-blank);
    transition: all .3s ease;
    
    &.is-expanded {
      height: 119px;
    }
    
    &:hover,
    &:focus-within {
      border-color: var(--color-primary);
    }
  }
  
  &__input {
    .el-textarea__inner {
      padding: 10px 15px 0 15px;
      box-shadow: none;
      font-size: 14px;
      line-height: 24px;
      background: none;
      color: var(--text-color-primary);
    }
  }
  
  &__toolbar {
    padding: 12px 15px 15px;
    text-align: right;
    cursor: text;
  }
  
  &__send-button {
    width: 90px;
    border-radius: 8px;
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