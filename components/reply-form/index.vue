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
        'is-expanded': isExpanded
      }">
      <el-input
        class="reply-form__input"
        ref="replyInput"
        v-model="reply"
        placeholder="Type something..."
        resize="none"
        :rows="isExpanded ? 2 : 1"
        type="textarea"
        @focus="isExpanded = true">
      </el-input>
      
      <transition
        name="slide-down">
        <div
          class="reply-form__toolbar"
          v-if="isExpanded"
          @click="onClickToolbar">
          <el-button
            class="reply-form__send-button"
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
import { ElButton, ElInput } from 'element-plus/dist/index.full'
import { ref } from 'vue'

const props = defineProps({
  customClass: {
    type: String
  },
  user: {
    type: Object,
    default () {
      return {}
    }
  }
})

const reply = ref('')
const emits = defineEmits([
  'reply'
])

let isExpanded = ref(false)
</script>

<script>
export default {
  // inheritAttrs: false
  methods: {
    onClickToolbar () {
      this.$refs.replyInput.focus()
    }
  }
}
</script>

<style lang="scss">
.reply-form {
  display: flex;
  
  .comment-item__control-bar + & {
    margin-top: 25px;
  }
  
  &__avatar {
    flex-shrink: 0;
    
    & + .reply-form__box {
      margin-left: 16px;
    }
  }
  
  &__box {
    flex: 1;
    height: 48px;
    border: 1px solid #E2E8ED;
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

.slide-down-enter-from,
.slide-down-leave-to {
  opacity: 0;
  transform: translateY(-72px);
}

.slide-down-enter-active,
.slide-down-leave-active {
  transition: all .3s ease;
}
</style>