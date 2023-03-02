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
          v-for="index in config"
          :key="index">
          <el-skeleton-item
            class="toolbar-skeleton__button"
            variant="button" />
          
          <el-skeleton-item
            class="toolbar-skeleton__count"
            variant="text" />
        </template>
      </div>
      
      <el-skeleton-item
        class="toolbar-skeleton__right toolbar-skeleton__button"
        v-if="showRight"
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

const props = defineProps({
  config: {
    type: Array,
    required: true
  },
  showRight: {
    type: Boolean,
    default: true
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
  
  &__right {
    flex-shrink: 0;
  }
}

@media screen and (max-width: #{$small-mobile-width - 1px}) {
  .toolbar-skeleton {
    &__button {
      width: 36px;
      height: 36px;
    }
    
    &__count {
      width: 15px;
      margin: 0 31px 0 6px;
    }
  }
}
</style>