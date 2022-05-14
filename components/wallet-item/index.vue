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
  border: 1px solid var(--border-color);
  background: var(--fill-color-blank);
  cursor: pointer;
  transition: all .3s ease;
  
  &.active,
  &:hover {
    border-color: var(--color-primary);
    box-shadow: 0 0 4px rgba(var(--color-primary-rgb), .5);
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
    text-align: center;
    color: var(--text-color-secondary);
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .wallet-item {
    width: 100%;
    flex-direction: row;
    justify-content: flex-start;
    padding: 12px 20px;
    
    &__logo {
      margin-right: 10px;
    }
    
    &__label {
      margin-top: 0;
      font-size: 12px;
    }
  }
}
</style>