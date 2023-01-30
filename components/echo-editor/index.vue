<template>
  <echo-editor-skeleton
    v-bind="$attrs"
    :class="customClass">
    <div
      class="echo-editor"
      :class="customClass">
      <el-tooltip
        :disabled="disabledTooltip"
        effect="dark"
        placement="bottom-start">
        <template 
          #content> 
          Avatar is synced from <br />your .bit or .eth records.
        </template>
        
        <echo-avatar
          class="echo-editor__avatar"
          :alt="store.screen_name"
          :hash="store.address"
          :src="store.avatar || ''">
        </echo-avatar>
      </el-tooltip>
      
      <div
        class="echo-editor__box">
        <el-input
          class="echo-editor__input"
          ref="replyInput"
          v-bind="$attrs"
          :autosize="{
            minRows: 1
          }"
          :placeholder="placeholder"
          resize="none"
          type="textarea"
          @focus="showToolbarValue = true"
          @keydown.enter="enter">
        </el-input>
        
        <transition
          name="slide-down">
          <div
            class="echo-editor__toolbar"
            v-show="showToolbarValue">
            <a 
              class="echo-editor__markdown-info"
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
              class="echo-editor__send-button"
              :loading="position === 'comment' ? false : status.onSubmitingTargetComment"
              size="large"
              type="primary"
              @click.stop="$emit('reply')">
              <template
                #loading>
                <echo-loader-spin
                  class="echo-editor__send-button-loader">
                </echo-loader-spin>
              </template>
              
              Send
            </el-button>
          </div>
        </transition>
      </div>
    </div>
  </echo-editor-skeleton>
</template>

<script setup>
import { ElButton, ElInput, ElTooltip } from 'element-plus'
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
.echo-editor {
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
  .echo-editor {
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