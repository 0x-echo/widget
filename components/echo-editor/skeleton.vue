<template>
  <el-skeleton
    class="echo-editor-skeleton"
    :class="customClass"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <el-skeleton-item
        class="echo-editor-skeleton__avatar"
        variant="circle" />
        
      <el-skeleton-item
        class="echo-editor-skeleton__input"
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
.echo-editor-skeleton {
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
  .echo-editor-skeleton {
    &__avatar {
      display: none;
    }
  }
}
</style>