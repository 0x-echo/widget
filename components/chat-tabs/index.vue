<template>
  <div
    class="chat-tabs">
    <tabs-skeleton
      v-bind="$attrs">
      <div
        class="chat-tabs__header"
        v-if="showHeader">
        <div
          class="chat-tabs__item"
          :class="{
            'active': item.value === activeTab
          }"
          v-for="item in tabs"
          :key="item.value"
          @click="onChangeTab(item.value)">
          <template v-if="item.count">{{ $formatNumber(item.count) }}</template> {{ item.count !== 1 ? item.plurLabel : item.label }}
        </div>
      </div>
    </tabs-skeleton>
    
    <div
      class="chat-tabs__content">
      <slot></slot>
    </div>
  </div>
</template>

<script setup>
import TabsSkeleton from './skeleton'
import useStore from '~~/store'

const store = useStore();
const counts = computed(() => store.counts)

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
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.chat-tabs {
  flex: 1;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  
  &__header {
    position: relative;
    display: flex; 
    margin-bottom: 28px;
    overflow-x: auto;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 1px;
      background: var(--bg-color);
    }
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  &__item {
    position: relative;
    flex-shrink: 0;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color-muted);
    cursor: pointer;
    transition: all .3s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: var(--color-primary);
      opacity: 0;
      transform: scale3d(0, 1, 1);
      transition: all .3s ease;
      z-index: 1;
    }
    
    &.active {
      color: var(--text-color-primary);
      
      &::after {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    }
    
    &:hover {
      color: var(--text-color-primary);
    }
  }
  
  &__content {
    flex: 1;
    overflow-y: auto;
    padding-top: 2px;
  }
}
</style>
