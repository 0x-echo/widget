<template>
  <el-skeleton
    class="toolbar-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <div
        class="toolbar-skeleton__left">
        <template
          class="toolbar-skeleton__item"
          v-for="index in config"
          :key="index">
          <el-skeleton-item
            variant="button" />
          
          <el-skeleton-item
            class="toolbar-skeleton__count"
            variant="text" />
        </template>
      </div>
      
      <el-skeleton-item
        variant="button" />
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
  config: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss">
.toolbar-skeleton {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  
  &__left {
    display: flex;
    align-items: center;
  }
  
  &__count {
    width: 15px;
    height: 22px;
    margin: 0 35px 0 8px;
  }
}
</style>