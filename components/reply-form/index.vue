<template>
  <div
    class="reply-form">
    <chat-avatar
      class="reply-form__avatar"
      :alt="user.name || 'Avatar'"
      :size="48"
      :src="user.avatar">
    </chat-avatar>
    
    <div
      class="reply-form__box">
      <el-input
        class="reply-form__input"
        v-model="reply"
        placeholder="Type something..."
        resize="none"
        type="textarea">
      </el-input>
      
      <el-button
        class="reply-form__send-button"
        type="primary">
        Send
      </el-button>
    </div>
  </div>
</template>

<script setup>
import { ElButton, ElInput } from 'element-plus/dist/index.full'
import { ref } from 'vue'

const props = defineProps({
  user: {
    type: Object,
    default () {
      return {}
    }
  }
})

const reply = ref('')
</script>

<script>
export default {
  // inheritAttrs: false
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
    position: relative;
    flex: 1;
  }
  
  &__input {
    .el-textarea__inner {
      height: 100px;
      padding: 12px 12px 54px;
      font-size: 15px;
    }
  }
  
  &__send-button {
    position: absolute;
    bottom: 12px;
    right: 12px;
    width: 90px;
  }
}
</style>