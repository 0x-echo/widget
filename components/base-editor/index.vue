<template>
  <base-editor-skeleton
    v-bind="$attrs"
    :class="customClass">
    <div
      class="base-editor"
      :class="customClass">
      <el-tooltip
        :disabled="disabledTooltip"
        effect="dark"
        placement="bottom-start">
        <template 
          #content> 
          Avatar is synced from <br />your .bit or .eth records.
        </template>
        
        <base-avatar
          class="base-editor__avatar"
          :alt="user.screen_name"
          :hash="user.address"
          :src="user.avatar || ''">
        </base-avatar>
      </el-tooltip>
      
      <div
        class="base-editor__box">
        <el-input
          class="base-editor__input"
          ref="replyInput"
          v-bind="$attrs"
          :autosize="{
            minRows: 1
          }"
          :placeholder="placeholder"
          resize="none"
          type="textarea"
          @focus="showToolbar = true"
          @keydown.enter="submit">
        </el-input>
        
        <transition
          name="slide-down">
          <div
            class="base-editor__toolbar"
            v-show="showToolbar">
            <a 
              class="base-editor__markdown-info"
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
              class="base-editor__send-button"
              :loading="submitLoading"
              size="large"
              type="primary"
              @click.stop="$emit('submit')">
              <template
                #loading>
                <base-loader-spin
                  class="base-editor__send-button-loader">
                </base-loader-spin>
              </template>
              
              Send
            </el-button>
          </div>
        </transition>
      </div>
    </div>
  </base-editor-skeleton>
</template>

<script setup>
import { ElButton, ElInput, ElTooltip } from 'element-plus'

const props = defineProps({
  autofocus: {
    type: Boolean,
    default: false
  },
  customClass: {
    type: String
  },
  disabledTooltip: {
    type: Boolean,
    default: true
  },
  showToolbarOnInit: {
    type: Boolean,
    default: false
  },
  submitLoading: {
    type: Boolean,
    default: false
  },
  placeholder: {
    type: String,
    default: 'Write a comment...'
  },
  user: {
    type: Object
  }
})

const emits = defineEmits([
  'submit'
])

let showToolbar = ref(props.showToolbarOnInit)

watch(() => props.autofocus, (val) => {
  if (val) {
    setTimeout(() => {
      focusInput()
    }, 150)
  }
})

const replyInput = ref(null)
const focusInput = () => {
  replyInput.value.focus()
}

const submit = (e) => {
  if (e.metaKey) {
    emits('submit')
  }
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.base-editor {
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
      color: var(--echo-text-color-primary);
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
    color: var(--echo-text-color-secondary);
    
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
  .base-editor {
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
      height: 36px;
      font-size: 14px;
      padding-top: 10px;
      padding-bottom: 10px;
    }
  }
}
</style>