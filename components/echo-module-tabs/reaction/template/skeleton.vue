<template>
  <el-skeleton
    class="echo-module-tabs-reaction-template-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <el-skeleton-item
        class="echo-module-tabs-reaction-template-skeleton__value"
        variant="text" />
      
      <div
        class="echo-module-tabs-reaction-template-skeleton__list">
        <div
          class="echo-module-tabs-reaction-template-skeleton__item"
          v-for="item in 2"
          :key="item">
          <el-skeleton-item
            class="el-skeleton__circle--small"
            variant="circle" />
          
          <div
            class="echo-module-tabs-reaction-template-skeleton__body">
            <el-skeleton-item
              class="echo-module-tabs-reaction-template-skeleton__title"
              variant="h1" />
              
            <!-- <el-skeleton-item
              class="echo-module-tabs-reaction-template-skeleton__subtitle"
              variant="text" /> -->
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
.echo-module-tabs-reaction-template-skeleton {
  padding: 0 20px;
  
  &__value {
    width: 180px;
    height: 37px;
    margin-bottom: 20px; 
  }
  
  &__list {
    display: flex;
  }
  
  &__item {
    display: flex;
    align-items: center;
    width: 150px;
    margin: 8px 50px 8px 0;
  }
  
  &__body {
    margin-left: 12px;
  }
  
  &__title {
    width: 60px;
    height: 21px;
  }
  
  &__subtitle {
    width: 30px;
    height: 14px;
    margin-top: 6px;
  }
}
</style>