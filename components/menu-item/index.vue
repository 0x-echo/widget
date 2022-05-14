<template>
  <div
    class="menu-item">
    <i
      class="menu-item__icon"
      :class="icon">
    </i>
    
    <span
      class="menu-item__label">
      {{ label }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String
  },
  label: {
    type: String
  }
})
</script>

<style lang="scss">
.menu-item {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  cursor: pointer;
  
  &:hover {
    background: var(--menu-item-bg-color);
    
    .menu-item__icon,
    .menu-item__label {
      color: var(--color-primary);
    }
  }
  
  &__icon {
    font-size: 16px;
    color: var(--text-color-muted);
    transition: all .3s ease;
    
    & + .menu-item__label {
      margin-left: 8px;
    }
  }
  
  &__label {
    font-size: 12px;
    color: var(--text-color-secondary);
    transition: all .3s ease;
  }
}
</style>