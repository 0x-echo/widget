<template>
  <component
    :is="tag"
    class="wallet-item"
    :class="{
      'active': active,
      'disabled': disabled,
      'wallet-item--row': direction === 'row'
    }"
    :target="tag === 'a' ? '_blank' : undefined" 
    :href="link">
    <img 
      v-if="icon"
      class="wallet-item__logo"
      :alt="label"
      :src="icon" 
      :title="label">
  
    <div
      class="wallet-item__label">
      <slot>
        {{ label }}
      </slot>
    </div>
    
    <sup
      class="wallet-item__badge"
      v-if="badge">
      {{ badge }}
    </sup>
  </component>
</template>

<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  badge: {
    type: String
  },
  direction: {
    type: String
  },
  disabled: {
    type: Boolean,
    default: false
  },
  icon: {
    type: String
  },
  label: {
    type: String
  },
  tag: {
    type: String,
    default: 'div'
  },
  link: {
    type: String
  }
})
</script>

<style lang="scss">
.wallet-item {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: calc((100% - 15px) / 2);
  padding: 15px 15px 12px;
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
  
  &.disabled {
    opacity: .6;
    cursor: not-allowed;
    
    &:hover {
      border-color: var(--border-color);
      box-shadow: none;
    }
  }
  
  &--row {
    flex-direction: row;
    justify-content: flex-start;
    padding: 12px 20px;
    
    .wallet-item__logo {
      margin-right: 10px;
    }
    
    .wallet-item__label {
      margin-top: 0;
      font-size: 12px;
    }
  }
  
  &__logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  
  &__label {
    margin-top: 6px;
    font-size: 13px;
    font-weight: 500;
    text-align: center;
    color: var(--text-color-secondary);
  }
  
  &__badge {
    position: absolute;
    top: 0;
    right: 0;
    padding: 0 6px;
    border-radius: 10px;
    font-size: 10px;
    font-weight: 500;
    text-transform: uppercase;
    background: var(--color-primary);
    color: white;
    transform: translate(20%, -50%);
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .wallet-item {
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