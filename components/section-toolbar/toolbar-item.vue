<template>
  <div
    class="toolbar-item">
    <el-button
      class="el-button--icon toolbar-item__button"
      :class="{
        'active': active
      }"
      size="large"
      :title="value"
      type="info"
      @click="$emit('on-click')">
      <i
        :class="icon">
      </i>
    </el-button>
    
    <transition
      name="slide-fade"
      mode="out-in">
      <span
        class="toolbar-item__count"
        v-if="hasCount"
        v-show="count"
        :key="count">
        {{ count }}
      </span>
    </transition>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus'

const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  count: {
    type: [Number, String]
  },
  hasCount: {
    type: Boolean,
    default: true
  },
  icon: {
    type: String
  },
  value: {
    type: String
  }
})

const emits = defineEmits([
  'on-click'
])
</script>

<style lang="scss">
.toolbar-item {
  display: flex;
  align-items: center;
  
  & + & {
    margin-left: 10px;
  }
  
  &__count {
    width: 40px;
    margin-left: 8px;
    font-size: 14px;
    color: var(--text-color-primary);
  }
}
</style>