<template>
  <template-skeleton
    v-bind="$attrs">
    <div
      class="section-template">
      <div
        class="section-template__value"
        v-if="value">
        {{ label }}: <strong>${{ value }}</strong>
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
import TemplateSkeleton from './skeleton'

const props = defineProps({
  label: {
    type: String
  },
  value: {
    type: String
  }
})
</script>

<style lang="scss">
.section-template {
  min-height: 300px;
  padding: 0 30px;
  
  &__value {
    margin-bottom: 30px;
    font-size: 14px;
    color: var(--text-color-secondary);
    
    strong {
      font-weight: bold;
    }
  }
  
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>