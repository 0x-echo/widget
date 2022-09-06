<template>
  <el-dialog
    v-bind="$attrs"
    append-to-body
    :close-on-click-modal="false"
    custom-class="dialog-report"
    destroy-on-close
    :show-close="false"
    width="90%"
    @close="reason = ''">
    <template
      #header>
      <dialog-header
        icon="ri-alert-line"
        title="Report"
        @close="close">
      </dialog-header>
    </template>
    
    <el-select
      class="dialog-report__select"
      :key="new Date()"
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
        :disabled="!reason"
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

const { public: { report }} = useRuntimeConfig()

const emits = defineEmits([
  'submit',
  'update:modelValue'
])

const reason = ref('')

const options = report.reasons.map(one => ({ label: one, value: one }))

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