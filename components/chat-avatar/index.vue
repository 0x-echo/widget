<template>
  <el-avatar
    class="chat-avatar">
    <boring-avatar
      :colors="colors" 
      :name="hash"
      size="100%"
      variant="beam" />
  </el-avatar>
</template>

<script setup>
import { ElAvatar } from 'element-plus'
import BoringAvatar from '@third.chat/vue-boring-avatars'

const props = defineProps({
  alt: {
    type: String
  },
  hash: {
    type: String,
    default: 'Avatar'
  }
})

const colors = ['#FFAD08', '#EDD75A', '#73B06F', '#0C8F8F', '#405059']
</script>

<style lang="scss">

</style>