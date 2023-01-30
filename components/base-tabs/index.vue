<template>
  <div
    class="base-tabs">
    <base-tabs-skeleton
      v-bind="$attrs">
      <div
        class="base-tabs__header"
        v-if="showHeader">
        <div
          class="base-tabs__nav"
          :class="{
            'is-mobile': isMobile
          }">
          <div
            class="base-tabs__item"
            :class="{
              'active': item.value === activeTab
            }"
            v-for="item in tabs"
            :key="item.value"
            @click="onChangeTab(item.value)">
            <i
              class="base-tabs__item-icon"
              :class="item.icon"
              v-if="isMobile">
            </i>
            
            <span
              class="base-tabs__item-count"
              v-if="item.count">
              {{ $formatNumber(item.count) }}
            </span>
            
            <span
              class="base-tabs__item-label"
              v-if="!isMobile">
              {{ item.count !== 1 ? item.plurLabel : item.label }}
            </span>
          </div>
        </div>
        
        <slot
          name="header-right">
        </slot>
      </div>
    </base-tabs-skeleton>
    
    <div
      class="base-tabs__content"
      @scroll="onScroll">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import BaseTabsSkeleton from './skeleton'

const props = defineProps({
  modelValue: {
    type: String
  },
  showHeader: {
    type: Boolean,
    default: true
  },
  tabs: {
    type: Array,
    required: true
  }
})

const emits = defineEmits([
  'load-more',
  'on-change-tab',
  'update:modelValue'
])

let activeTab = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})

provide('tabProps', props)

const onChangeTab = (value) => {
  activeTab.value = value
  emits('on-change-tab', value)
}

let isMobile = ref(false)
onMounted(() => {
  checkIfMobile()
  window.addEventListener('resize', checkIfMobile)
})

onUnmounted(() => {
  window.removeEventListener('resize', checkIfMobile)
})

const checkIfMobile = () => {
  const tabs = document.querySelector('.base-tabs')
  if (tabs.clientWidth < 500) {
    isMobile.value = true
  } else {
    isMobile.value = false
  }
}

const onScroll = (e) => {
  const { scrollTop, clientHeight, scrollHeight } = e.target
  if (scrollTop + clientHeight + 100 >= scrollHeight) {
    emits('load-more')
  }
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.base-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  &__header {
    position: relative;
    display: flex; 
    justify-content: space-between;
    align-items: center;
    margin-bottom: 28px;
    overflow-x: auto;
    border-bottom: 1px solid var(--echo-bg-color);
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  &__nav {
    display: flex; 
    
    &.is-mobile {
      width: 100%;
      
      .base-tabs__item {
        min-width: 25%;
        padding: 0 10px;
      }
    }
  }
  
  &__item {
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--echo-text-color-muted);
    cursor: pointer;
    transition: all .3s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--echo-color-primary);
      opacity: 0;
      transform: scale3d(0, 1, 1);
      transition: all .3s ease;
      z-index: 1;
    }
    
    &.active {
      color: var(--echo-text-color-primary);
      
      &::after {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    }
    
    &:hover {
      color: var(--echo-text-color-primary);
    }
  }
  
  &__item-icon {
    font-size: 16px;
    
    + .base-tabs__item-count {
      margin-left: 5px;
    }
  }
  
  &__item-count {
    + .base-tabs__item-label {
      margin-left: 5px;
    }
  }
  
  &__content {
    flex: 1;
    overflow-y: auto;
    padding: 2px 5px 0 0;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
}
</style>
