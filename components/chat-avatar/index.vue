<template>
  <el-avatar
    v-bind="$attrs"
    :alt="alt"
    :title="alt">
    <img
      src="@/assets/default-avatar.svg" />
  </el-avatar>
</template>

<script setup>
import { ElAvatar } from 'element-plus/dist/index.full'

const props = defineProps({
  alt: {
    type: String
  }
})
</script>

<style lang="scss">

</style>