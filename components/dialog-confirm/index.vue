<template>
  <echo-dialog
    class="dialog-confirm"
    has-action-footer
    @cancel="$emit('update:modelValue', false)"
    @on-close="$emit('update:modelValue', false)">
    <div
      class="dialog-confirm__message">
      <slot>
        {{ message }}
      </slot>
    </div>
  </echo-dialog>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String
  }
})

const emits = defineEmits([
  'update:modelValue'
])
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
    background: var(--echo-bg-color);
    color: var(--echo-text-color-secondary);
  }
}
</style>