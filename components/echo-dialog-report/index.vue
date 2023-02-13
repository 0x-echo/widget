<template>
  <base-dialog
    class="echo-dialog-report"
    :confirm-button-disabled="reason === ''"
    has-action-footer
    title="Report"
    title-icon="ri-alert-line"
    @cancel="$emit('update:modelValue', false)"
    @close="reason = ''"
    @on-close="$emit('update:modelValue', false)"
    @submit="submit">
    <el-select
      class="echo-dialog-report__select"
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
  </base-dialog>
</template>

<script setup>
import { ElSelect, ElOption } from 'element-plus'

const { public: { report }} = useRuntimeConfig()

const emits = defineEmits([
  'submit',
  'update:modelValue'
])

const reason = ref('')

const options = report.reasons.map(one => ({ label: one, value: one }))

const submit = () => {
  emits('submit', reason.value)
}
</script>

<style lang="scss">
.echo-dialog-report {  
  &__select {
    width: 100%;
  }
}
</style>