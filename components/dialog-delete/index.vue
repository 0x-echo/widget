<template>
  <el-dialog
    v-bind="$attrs"
    :close-on-click-modal="false"
    custom-class="dialog-delete"
    :show-close="false"
    width="90%">
    <template
      #title>
      <dialog-header
        icon="ri-close-circle-line"
        title="Delete Comment?"
        @close="close">
      </dialog-header>
    </template>
    
    <div>
      The action cannot be undone.
    </div>
    
    <div
      class="dialog-delete__footer">
      <el-button
        size="large"
        @click="close">
        Cancel
      </el-button>
      
      <el-button
        size="large"
        type="primary"
        @click="submit">
        Submit
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElButton, ElDialog } from 'element-plus'

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
.dialog-delete {
  &.el-dialog {
    max-width: 485px;
  }
  
  &__select {
    width: 100%;
  }
  
  &__footer {
    margin-top: 30px;
    text-align: right;
    
    .el-button {
      width: 100px;
    }
  }
}
</style>