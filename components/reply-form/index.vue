<template>
  <div
    class="reply-form"
    :class="customClass">
    <chat-avatar
      class="reply-form__avatar"
      :alt="user.name || 'Avatar'"
      :size="48"
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
        @focus="isExpandedValue = true">
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
</template>

<script setup>
import { ref, watch } from 'vue'
import { ElButton, ElInput } from 'element-plus/dist/index.full'

const props = defineProps({
  customClass: {
    type: String
  },
  isFocus: {
  isExpanded: {
    type: Boolean,
    default: false
  },
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

watch(() => props.isFocus, (val) => {
  if (val) {
    replyInput.value.focus()
  } else {
    isExpanded.value = false
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
    
    & + .reply-form__box {
      margin-left: 16px;
    }
  }
  
  &__box {
    flex: 1;
    height: 48px;
    border: 1px solid $border-color;
    border-radius: $border-radius;
    background: white;
    transition: all .3s ease;
    
    &.is-expanded {
      height: 119px;
    }
    
    &:hover,
    &:focus-within {
      border-color: $primary;
    }
  }
  
  &__input {
    .el-textarea__inner {
      padding: 10px 15px 0 15px;
      box-shadow: none;
      font-size: 14px;
      line-height: 24px;
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
</style>