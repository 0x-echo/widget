<template>
  <el-dialog
    v-bind="$attrs"
    :close-on-click-modal="false"
    custom-class="dialog-report"
    :show-close="false"
    width="90%">
    <template
      #title>
      <dialog-header
        icon="ri-alert-line"
        title="Report"
        @close="close">
      </dialog-header>
    </template>
    
    <el-select
      class="dialog-report__select"
      v-model="reason"
      placeholder="Please select reason"
      size="large">
      <el-option
        v-for="item in options"
        :key="item.value"
        :label="item.label"
        :value="item.value" />
    </el-select>
    
    <div
      class="dialog-report__footer">
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
import { ElButton, ElDialog, ElSelect, ElOption } from 'element-plus'
import iconMatemask from '@/assets/metamask.svg'


const emits = defineEmits([
  'submit',
  'update:modelValue'
])

const reason = ref('')

const options = [{
  label: 'hello',
  value: '1'
}, {
  label: 'world',
  value: '2'
}]

const close = () => {
  emits('update:modelValue', false)
}

const submit = () => {
  emits('submit', reason.value)
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>


<style lang="scss">
.dialog-report {
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