<template>
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
</template>

<script setup>
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
    color: $text-secondary;
    
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