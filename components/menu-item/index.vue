<template>
  <div
    class="menu-item"
    :class="{
      'is-danger': danger,
      'is-disabled': disabled,
      'is-selected': selected
    }"
    v-if="!isLink"
    @click="$emit('on-click')">
    <menu-item-inner
      v-bind="$attrs">
    </menu-item-inner>
  </div>
  
  <a 
    class="menu-item"
    :class="{
      'is-danger': danger,
      'is-disabled': disabled
    }"
    v-if="isLink"
    :href="url"
    rel="noopener noreferrer"
    target="_blank"
    @click="$emit('on-click')">
    <menu-item-inner
      v-bind="$attrs">
    </menu-item-inner>
  </a>
</template>

<script setup>
import MenuItemInner from './menu-item-inner'

const props = defineProps({
  danger: {
    type: Boolean,
    default: false
  },
  disabled: {
    type: Boolean,
    default: false
  },
  isLink: {
    type: Boolean,
    default: false
  },
  selected: {
    type: Boolean,
    default: false
  },
  url: {
    default: ''
  }
})

const emits = defineEmits([
  'on-click'
])
</script>

<style lang="scss">
.menu-item {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  color: var(--text-color-secondary);
  cursor: pointer;
  transition: all .3s ease;
  
  &:hover,
  &.is-selected {
    &:not(.is-disabled):not(.is-danger) {
      background: var(--menu-item-bg-color);
      color: var(--color-primary);
    }
    
    .menu-item__icon {
      opacity: 1;
    }
  }
  
  &.is-disabled {
    opacity: .8;
    cursor: not-allowed;
  }
  
  &.is-danger {
    color: var(--color-danger);
      
    &:hover {
      background: var(--menu-item-bg-color-danger);
    }
  }
  
  &__icon {
    font-size: 16px;
    opacity: .7;
    
    & + .menu-item__label {
      margin-left: 8px;
    }
  }
  
  &__label {
    text-align: left;
    font-size: 12px;
  }
}
</style>