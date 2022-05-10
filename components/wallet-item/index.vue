<template>
  <div
    class="wallet-item"
    :class="{
      'active': active
    }">
    <img 
      class="wallet-item__logo"
      :alt="data.label"
      :src="data.icon" 
      :title="data.label">
    
    <div
      class="wallet-item__label">
      {{ data.label }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  data: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss">
.wallet-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc((100% - 15px) / 2);
  padding: 15px 15px 12px;
  margin-bottom: 15px;
  border-radius: 12px;
  background: white;
  border: 1px solid #E2E8ED;
  cursor: pointer;
  transition: all .3s ease;
  
  &.active,
  &:hover {
    border-color: $primary;
    box-shadow: 0 0 4px rgba($primary, .5);
  }
  
  &__logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  
  &__label {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 500;
    color: $text-secondary;
  }
}
</style>