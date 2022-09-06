<template>
  <el-dialog
    v-bind="$attrs"
    append-to-body
    :close-on-click-modal="false"
    custom-class="dialog-confirm"
    destroy-on-close
    :show-close="false"
    width="90%">
    <template
      #header>
      <dialog-header
        :icon="icon"
        :title="title"
        @close="close">
      </dialog-header>
    </template>
    
    <div
      class="dialog-confirm__message">
      <slot>
        {{ message }}
      </slot>
    </div>
    
    <div
      class="dialog-confirm__footer">
      <el-button
        @click="close">
        Cancel
      </el-button>
      
      <el-button
        :type="confirmButtonType"
        @click="submit">
        {{ confirmButtonText }}
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElButton, ElDialog } from 'element-plus'

const props = defineProps({
  confirmButtonText: {
    type: String,
    default: 'Sure'
  },
  confirmButtonType: {
    type: String,
    default: 'primary'
  },
  icon: {
    type: String
  },
  message: {
    type: String
  },
  title: {
    type: String
  }
})

const emits = defineEmits([
  'submit',
  'update:modelValue'
])

const close = () => {
  emits('update:modelValue', false)
}

const submit = () => {
  emits('submit')
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>


<style lang="scss">
.dialog-confirm {
  &.el-dialog {
    max-width: 450px;
  }
  
  .el-dialog__header {
    padding: 30px 30px 0;
  }
  
  .el-dialog__body {
    padding: 25px 30px 30px;
  }
  
  &__message {
    padding: 15px;
    border-radius: 10px;
    background: var(--bg-color);
  }
  
  &__footer {
    margin-top: 30px;
    text-align: right;
    
    .el-button {
      width: 100px;
      height: 36px;
    }
  }
}
</style>