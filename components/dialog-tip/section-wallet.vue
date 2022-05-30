<template>
  <section
    class="section-wallet">
    <section-header
      title="Choose Wallet">
    </section-header>
    
    <div
      class="section-wallet__content">
      <div
        class="section-wallet__content-wrapper">
        <wallet-item
          class="section-wallet__item"
          v-for="item in list"
          :key="item.value"
          :active="item.value === activeOption"
          :icon="item.icon"
          :label="item.value"
          @click="changeOption(item)">
          {{ $ellipsisInMiddle(item.value) }}
        </wallet-item>
        
        <div
          class="wallet-item section-wallet__item section-wallet__add">
          <i
            class="ri-add-line">
          </i>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import SectionHeader from './section-header'
import useStore from '~~/store'
import metamaskLogo from '@/assets/metamask.svg'

const store = useStore()

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
  icon: metamaskLogo,
  value: '0x123424245535'
}]
</script>

<style lang="scss">
.section-wallet {
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
    width: 160px;
    margin-bottom: 0;
    
    & + & {
      margin-left: 15px;
    }
  }
  
  &__add {
    justify-content: center;
    padding: 0;
    font-size: 20px;
    color: rgba(146, 154, 178, .8);
    
    &:hover {
      border-color: var(--border-color);
      box-shadow: none;
      color: var(--text-color-muted);
    }
  }
}
</style>