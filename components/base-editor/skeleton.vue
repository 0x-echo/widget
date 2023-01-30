<template>
  <el-skeleton
    class="base-editor-skeleton"
    :class="customClass"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <el-skeleton-item
        class="base-editor-skeleton__avatar"
        variant="circle" />
        
      <el-skeleton-item
        class="base-editor-skeleton__input"
        variant="rect" />
    </template>
    
    <template
      #default>
      <slot></slot>
    </template>
  </el-skeleton>
</template>

<script setup>
import { ElSkeleton, ElSkeletonItem } from 'element-plus'

const props = defineProps({
  customClass: {
    type: String
  }
})
</script>

<style lang="scss">
.base-editor-skeleton {
  display: flex;
  align-items: center;
  
  &__avatar {
    margin-right: 16px;
  }
  
  &__input {
    flex: 1;
    height: 48px;
    border-radius: 12px;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .base-editor-skeleton {
    &__avatar {
      display: none;
    }
  }
}
</style>