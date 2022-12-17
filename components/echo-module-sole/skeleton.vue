<template>
  <el-skeleton
    class="echo-module-sole-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <div
        class="echo-module-sole-skeleton__top">
        <el-skeleton-item
          class="el-skeleton__circle--large"
          variant="circle" />
      </div>
        
      <el-skeleton-item
        class="echo-module-sole-skeleton__user-name"
        variant="h1" />
        
      <el-skeleton-item
        class="echo-module-sole-skeleton__bio"
        variant="text" />
      
      <el-skeleton-item
        class="echo-module-sole-skeleton__action-button"
        variant="button" />
    </template>
    
    <template
      #default>
      <slot></slot>
    </template>
  </el-skeleton>
</template>

<script setup>
import { ElSkeleton, ElSkeletonItem } from 'element-plus'
</script>

<style lang="scss">
.echo-module-sole-skeleton {
  display: flex;
  flex-direction: column;
  align-items: center;
  
  &__top {
    display: flex;
    align-items: center;
    width: 100%;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--echo-bg-color);
    }
    
    &::before {
      margin-right: 30px;
    }
    
    &::after {
      margin-left: 30px;
    }
  }
  
  &__user-name {
    width: 80px;
    height: 28px;
    margin-top: 12px;
  }
  
  &__bio {
    width: 165px;
    height: 18px;
    margin-top: 6px;
  }
  
  &__action-button {
    width: 200px;
    height: 44px;
    margin-top: 15px;
  }
}
</style>