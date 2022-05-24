<template>
  <template-skeleton
    v-bind="$attrs">
    <div
      class="section-template">
      <div
        v-if="value">
        <el-tooltip
          :content="tip"
          :disabled="tip === ''"
          placement="top-start">
          <div
            class="section-template__value">
            <i
              class="ri-flashlight-fill section-template__light-icon">
            </i>
            
            <span>
              {{ label }}: ${{ value }}
            </span>
          </div>
        </el-tooltip>
      </div>
      
      <div
        class="section-template__list">
        <slot>
        </slot>
      </div>
    </div>
  </template-skeleton>
</template>

<script setup>
import { ElTooltip } from 'element-plus'
import TemplateSkeleton from './skeleton'

const props = defineProps({
  label: {
    type: String
  },
  tip: {
    type: String
  },
  value: {
    type: [String, Number]
  }
})
</script>

<style lang="scss">
.section-template {
  padding: 0 30px;
  
  &__value {
    display: inline-flex;
    align-items: center;
    padding: 5px 15px 5px 10px;
    margin-bottom: 30px;
    border-radius: var(--border-radius);
    font-size: 14px;
    font-weight: bold;
    background: rgba(var(--color-warning-rgb), .1);
    color: var(--text-color-secondary);
  }
  
  &__light-icon {
    margin-right: 5px;
    font-size: 18px;
    font-weight: 400;
    color: var(--color-warning);
  }
  
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>