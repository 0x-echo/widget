<template>
  <div
    class="load-more">
    <el-button
      class="el-button--icon load-more__button"
      size="large">
      <i
        class="ri-more-line">
      </i>
    </el-button>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus/dist/index.full'
</script>

<style lang="scss">
.load-more {
  margin-top: 15px;
  text-align: center;
  
  &__button {
    padding-left: 7px;
    padding-right: 7px;
    font-size: 24px;
    
    &,
    &:focus:not(.el-button:hover) {
      border-color: white;
      background: white;
      color: $text-muted;
    }
    
    &:hover,
    &:focus {
      border-color: $bg-color;
      background: $bg-color;
      color: $text-muted;
    }
  }
}
</style>