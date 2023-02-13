<template>
  <el-skeleton
    class="echo-reaction-list-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <el-skeleton-item
        class="echo-reaction-list-skeleton__value"
        variant="text" />
      
      <div
        class="echo-reaction-list-skeleton__list">
        <div
          class="echo-reaction-list-skeleton__item"
          v-for="item in 2"
          :key="item">
          <el-skeleton-item
            class="el-skeleton__circle--small"
            variant="circle" />
          
          <div
            class="echo-reaction-list-skeleton__body">
            <el-skeleton-item
              class="echo-reaction-list-skeleton__title"
              variant="h1" />
              
            <!-- <el-skeleton-item
              class="echo-reaction-list-skeleton__subtitle"
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
.echo-reaction-list-skeleton {
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