<template>
  <el-skeleton
    class="comment-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <div
        class="comment-skeleton__item"
        v-for="index in 2"
        :key="index">
        <el-skeleton-item
          class="comment-skeleton__avatar"
          variant="circle" />
          
        <div
          class="comment-skeleton__body">
          <el-skeleton-item
            class="comment-skeleton__author"
            variant="h1" />
            
          <el-skeleton-item
            class="comment-skeleton__meta"
            variant="text" />
            
          <el-skeleton-item
            class="comment-skeleton__content"
            variant="rect" />
            
          <el-skeleton-item
            class="comment-skeleton__action"
            variant="rect" />
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
import { ElSkeleton, ElSkeletonItem } from 'element-plus/dist/index.full'
</script>

<style lang="scss">
.comment-skeleton {
  &__item {
    display: flex;
    
    & + & {
      margin-top: 30px;
    }
  }
  
  &__body {
    flex: 1;
    margin-left: 16px;
  }
  
  &__author {
    width: 80px;
    height: 22px;
  }
  
  &__meta {
    width: 116px;
    height: 14px;
    margin: 6px 0 8px;
  }
  
  &__content {
    height: 48px;
  }
  
  &__action {
    width: 185px;
    height: 21px;
    margin-top: 6px;
  }
}
</style>