<template>
  <el-skeleton
    class="template-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <el-skeleton-item
        class="template-skeleton__value"
        variant="text" />
      
      <div
        class="template-skeleton__list">
        <div
          class="template-skeleton__item"
          v-for="item in 2"
          :key="item">
          <el-skeleton-item
            class="el-skeleton__circle--small"
            variant="circle" />
          
          <div
            class="template-skeleton__body">
            <el-skeleton-item
              class="template-skeleton__title"
              variant="h1" />
              
            <el-skeleton-item
              class="template-skeleton__subtitle"
              variant="text" />
          </div>
        </div>
      </div>
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
.template-skeleton {
  padding: 0 30px;
  
  &__value {
    width: 200px;
    height: 21px;
    margin-bottom: 30px; 
  }
  
  &__list {
    display: flex;
  }
  
  &__item {
    display: flex;
    align-items: center;
    margin-right: 50px;
  }
  
  &__body {
    margin-left: 12px;
  }
  
  &__title {
    width: 60px;
    height: 18px;
  }
  
  &__subtitle {
    width: 30px;
    height: 14px;
    margin-top: 6px;
  }
}
</style>