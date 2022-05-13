<template>
  <el-skeleton
    class="form-skeleton"
    :class="customClass"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <el-skeleton-item
        class="form-skeleton__avatar"
        variant="circle" />
        
      <el-skeleton-item
        class="form-skeleton__input"
        variant="rect" />
    </template>
    
    <template
      #default>
      <slot></slot>
    </template>
  </el-skeleton>
</template>

<script setup>
import { ElSkeleton, ElSkeletonItem } from 'element-plus/dist/index.full'

const props = defineProps({
  customClass: {
    type: String
  }
})
</script>

<style lang="scss">
.form-skeleton {
  display: flex;
  align-items: center;
  
  &__input {
    flex: 1;
    height: 48px;
    margin-left: 16px;
    border-radius: 12px;
  }
}
</style>