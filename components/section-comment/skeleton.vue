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
import { ElSkeleton, ElSkeletonItem } from 'element-plus'
</script>

<style lang="scss">
.comment-skeleton {
  &__item {
    display: flex;
    
    & + & {
      margin-top: 20px;
    }
  }
  
  &__avatar {
    margin-right: 16px;
  }
  
  &__body {
    flex: 1;
  }
  
  &__author {
    width: 80px;
    height: 14px;
    margin-top: 6px;
  }
  
  &__meta {
    width: 116px;
    height: 12px;
    margin: 5px 0 9px;
  }
  
  &__content {
    height: 24px;
  }
  
  &__action {
    width: 185px;
    height: 20px;
    margin-top: 9px;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .comment-skeleton {
    &__avatar {
      width: 30px;
      height: 30px;
      margin-right: 10px;
    }
  }
}
</style>