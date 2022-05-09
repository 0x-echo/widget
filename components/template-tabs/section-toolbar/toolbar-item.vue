<template>
  <div
    class="toolbar-item">
    <el-button
      class="el-button--icon toolbar-item__button"
      :class="{
        'active': active
      }"
      size="large"
      type="info">
      <i
        :class="icon">
      </i>
    </el-button>
    
    <span
      class="toolbar-item__count"
      v-if="count">
      {{ count }}
    </span>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus/dist/index.full'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  count: {
    type: [Number, String]
  },
  icon: {
    type: String
  }
})
</script>

<style lang="scss">
.toolbar-item {
  display: flex;
  align-items: center;
  
  & + & {
    margin-left: 20px;
  }
  
  &__button {
    
  }
  
  &__count {
    margin-left: 8px;
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
  }
}
</style>