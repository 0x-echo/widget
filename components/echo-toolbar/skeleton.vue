<template>
  <el-skeleton
    class="echo-toolbar-skeleton"
    v-bind="$attrs"
    animated>
    <template 
      #template>
      <div
        class="echo-toolbar-skeleton__left">
        <template
          class="echo-toolbar-skeleton__item"
          v-for="index in config"
          :key="index">
          <el-skeleton-item
            variant="button" />
          
          <el-skeleton-item
            class="echo-toolbar-skeleton__count"
            variant="text" />
        </template>
      </div>
      
      <el-skeleton-item
        class="echo-toolbar-skeleton__right"
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
.echo-toolbar-skeleton {
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

@media screen and (max-width: #{$small-mobile-width - 1px}) {
  .echo-toolbar-skeleton {
    &__right {
      display: none;
    }
  }
}
</style>