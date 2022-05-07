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
  justify-content: center;
  cursor: pointer;
  
  &:hover {
    .menu-item__icon,
    .menu-item__label {
      color: $primary;
    }
  }
  
  &__icon {
    font-size: 16px;
    color: $text-muted;
    transition: all .3s ease;
    
    & + .menu-item__label {
      margin-left: 8px;
    }
  }
  
  &__label {
    font-size: 12px;
    color: $text-secondary;
    transition: all .3s ease;
  }
}
</style>