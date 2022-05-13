<template>
  <el-skeleton
    class="tabs-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <el-skeleton-item
        v-for="index in 2"
        :key="index"
        class="tabs-skeleton__item"
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
</script>

<style lang="scss">
.tabs-skeleton {
  display: flex;
  align-items: center;
  margin-bottom: 30px;
  border-bottom: 1px solid $bg-color;
  
  &__item {
    width: 100px;
    height: 30px;
    margin-bottom: 8px;
    
    & + & {
      margin-left: 10px;
    }
  }
}
</style>