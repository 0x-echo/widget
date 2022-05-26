<template>
  <i
    class="ri-file-copy-line icon-copy"
    :title="title"
    v-clipboard:copy="value"
    v-clipboard:success="onSuccess"
    v-clipboard:error="onError">
  </i>
</template>

<script setup>
import { ElMessage } from 'element-plus'

const props = defineProps({
  value: {
    type: String,
    required: true
  },
  title: {
    type: String,
    default: 'copy'
  }
})

const onError = () => {
  ElMessage.error({
    message: 'Opps! Something went wrong!'
  }) 
}
const onSuccess = () => {
  ElMessage.success({
    message: 'Copied!'
  })
}
</script>

<style lang="scss">
.icon-copy {
  color: rgba(var(--text-color-muted), .8);
  cursor: pointer;
  
  &:hover {
    color: var(--color-primary);
  }
}
</style>
