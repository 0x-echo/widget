<template>
  <section
    class="section-network">
    <section-header
      title="Choose Network">
    </section-header>
    
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
          :badge="item.badge"
          :icon="item.icon"
          :label="item.label"
          @click="changeOption(item)">
        </wallet-item>
      </div>
      
      <!-- <el-button
        class="section-network__arrow-button"
        v-if="scrollButtonVisible"
        size="small"
        @click="scollToRight">
        <i
          class="ri-arrow-right-s-line">
        </i>
      </el-button> -->
    </div>
  </section>
</template>

<script setup>
import { ElButton, ElMessage } from 'element-plus'
import SectionHeader from './section-header'
import useChain from '@/compositions/chain'
import EverPay from 'everpay'

import ethLogo from '~~/assets/chains/ethereum.png'
import polygonLogo from '~~/assets/chains/polygon.png'
import opLogo from '~~/assets/chains/optimism.svg'

import useStore from '~~/store'

const { logos } = useChain()
const store = useStore()
const everpay = new EverPay()

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

const changeOption = async (item) => {
  activeOption.value = item.value
  store.setTipNetwork(item.value)

  if (item.value === 'everpay') {
    store.setData('tip', {
      onFetchingEverPay: true
    })
    try {
      const balances = await everpay.balances({
        chainType: 'ethereum',
        account: store.address
      })
      const finalList = balances.filter(one => one.balance !== '0')
      store.setData('tip', { availableTokens: finalList })
    } catch (e) {
     ElMessage.error('Fail to get everPay balances. Please try again later.')
    } finally {
      store.setData('tip', {
        onFetchingEverPay: false
      })
    }
  } else {
    store.setData('tip', { availableTokens: [] })
  }
}

const list = [{
  label: 'Ethereum',
  icon: logos['EVM/1'],
  value: 'ethereum'
}, {
  badge: 'no gas',
  label: 'everPay',
  icon: 'https://app.everpay.io/favicon.png',
  value: 'everpay'
}, {
  label: 'Polygon',
  icon: logos['EVM/137'],
  value: 'polygon'
}, {
  label: 'BSC',
  icon: logos['EVM/56'],
  value: 'bsc'
}]

if (store.widgetConfig['support_mumbai']) {
  list.push({
    label: 'Mumbai(for test)',
    icon: logos['EVM/137'],
    value: 'mumbai'
  })
}

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
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr;
    gap: 15px;
    padding: 7px 2px 2px;
    margin: 0 -2px;
  }
  
  &__item {
    width: 100%;
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
    &__content-wrapper {
      grid-template-columns: 1fr 1fr;
      gap: 10px;
    }
    
    &__item {
      flex-direction: column;
      justify-content: center;
      padding: 12px;
    }
    
    .wallet-item__logo {
      margin-right: 0;
    }
    
    .wallet-item__label {
      margin-top: 6px;
    }
    
    &__arrow-button {
      top: 13px;
    }
  }
}
</style>