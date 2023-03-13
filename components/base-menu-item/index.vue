<template>
  <div
    class="base-menu-item"
    :class="{
      'is-danger': danger,
      'is-disabled': disabled,
      'is-selected': selected
    }"
    v-if="!isLink"
    @click="$emit('on-click')">
    <base-menu-item-inner
      v-bind="$attrs">
    </base-menu-item-inner>
  </div>
  
  <a 
    class="base-menu-item"
    :class="{
      'is-danger': danger,
      'is-disabled': disabled
    }"
    v-if="isLink"
    :href="url"
    rel="noopener noreferrer"
    target="_blank"
    @click="$emit('on-click')">
    <base-menu-item-inner
      v-bind="$attrs">
    </base-menu-item-inner>
  </a>
</template>

<script setup>
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
.base-menu-item {
  display: flex;
  align-items: center;
  height: 36px;
  padding: 0 10px;
  border-radius: 10px;
  color: var(--echo-text-color-secondary);
  cursor: pointer;
  transition: all .3s ease;
  
  &:hover,
  &.is-selected {
    &:not(.is-disabled):not(.is-danger) {
      background: var(--echo-menu-item-bg-color);
      color: var(--echo-color-primary);
    }
    
    .base-menu-item__icon {
      opacity: 1;
    }
  }
  
  &.is-disabled {
    opacity: .8;
    cursor: not-allowed;
  }
  
  &.is-danger {
    color: var(--echo-color-danger);
      
    &:hover {
      background: var(--echo-menu-item-bg-color-danger);
    }
  }
  
  &__icon {
    font-size: 16px;
    opacity: .7;
    
    & + .base-menu-item__label {
      margin-left: 8px;
    }
  }
  
  &__label {
    flex: 1;
    text-align: left;
    font-size: 12px;
  }
  
  &__count {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    font-size: 10px;
    background: var(--echo-color-danger);
    color: white;
  }
}
</style>