<template>
  <section
    class="section-network">
    <h3
      class="dialog-tip__section-title">
      Choose Network
    </h3>
    
    <div
      class="section-network__content">
      <div
        class="section-network__content-wrapper"
        ref="networkBox"
        @scroll="handleScroll">
        <wallet-item
          class="section-network__item"
          v-for="item in list"
          :key="item.value"
          :active="item.value === activeOption"
          :data="item"
          @click="changeOption(item)">
        </wallet-item>
      </div>
      
      <el-button
        class="section-network__arrow-button"
        v-if="scrollButtonVisible"
        size="small"
        @click="scollToRight">
        <i
          class="ri-arrow-right-s-line">
        </i>
      </el-button>
    </div>
  </section>
</template>

<script setup>
import { ElButton } from 'element-plus'
import iconMatemask from '@/assets/metamask.svg'

const props = defineProps({
  modelValue: {
    type: String
  }
})

const emits = defineEmits([
  'update:modelValue'
])

const activeOption = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})

const changeOption = (item) => {
  activeOption.value = item.value
}

const list = [{
  label: 'Ethereum',
  icon: iconMatemask,
  value: 'ethereum'
}, {
  label: 'Polygon',
  icon: iconMatemask,
  value: 'polygon'
}, {
  label: 'Binance Chain',
  icon: iconMatemask,
  value: 'binance'
}, {
  label: 'Ethereum1',
  icon: iconMatemask,
  value: 'ethereum1'
}, {
  label: 'Ethereu2',
  icon: iconMatemask,
  value: 'ethereum2'
}]

const networkBox = ref(null)
const scrollButtonVisible = ref(true)
const scollToRight = () => {
  networkBox.value.scrollLeft += 175
  if (networkBox.value.scrollLeft + networkBox.value.clientWidth === networkBox.value.scrollWidth) {
    scrollButtonVisible.value = false
  }
}

const handleScroll = (el) => {
  if (el.srcElement.scrollLeft + el.srcElement.clientWidth < el.srcElement.scrollWidth) {
    scrollButtonVisible.value = true
  } else {
    scrollButtonVisible.value = false
  }
}
</script>

<style lang="scss">
.section-network {
  &__content {
    position: relative;
  }
  
  &__content-wrapper {
    display: flex;
    overflow-x: auto;
    padding: 2px;
    margin: 0 -2px;
    
    &::-webkit-scrollbar {
      display: none;
    }
  }
  
  &__item {
    flex-shrink: 0;
    width: 160px;
    margin-bottom: 0;
    
    & + & {
      margin-left: 15px;
    }
  }
  
  &__arrow-button {
    position: absolute;
    top: 27px;
    right: -12px;
    padding-left: 3px;
    padding-right: 3px;
    font-size: 16px;
    border-radius: 50%;
    box-shadow: 0 0 10px rgba(black, .1);
    
    &,
    &:focus:not(.el-button:hover) {
      border-color: white; 
      background: var(--fill-color-blank);
      color: var(--text-color-primary);
    }
    
    &:hover,
    &:focus {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: white;
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .section-network {
    &__item {
      width: auto;
      
      & + & {
        margin-left: 10px;
      }
    }
    
    &__arrow-button {
      top: 13px;
    }
  }
}
</style>