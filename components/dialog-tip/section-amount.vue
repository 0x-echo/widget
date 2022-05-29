<template>
  <section
    class="section-amount">
    <section-header
      class="section-amount__header"
      title="Choose Amount">
      <span
        class="dialog-tip__tip">
        {{ placeholder }}
      </span>
    </section-header>
    
    <div
      class="section-amount__content">
      <div
        class="section-amount__item"
        :class="{
          'active': item === activeAmount && !customAmount
        }"
        v-for="item in list"
        :key="item"
        @click="changeAmount(item)">
        ${{ item }}
      </div>
      
      <div
        class="section-amount__custom"
        :class="{
          'active': customAmount !== undefined
        }">
        <span>
          $
        </span>
        
        <el-input-number
          class="section-amount__custom-input"
          v-model="customAmount"
          :controls="false"
          :min="0.0001"
          :precision="4"
          size="large"
          @input="onChangeInput"
          @blur="onBlurInput" />
      </div>
    </div>
    
    <el-collapse-transition>
      <div 
        class="dialog-tip__tip"
        v-if="store.tip_amount">
        <template v-if="store.currency[store.tip_network].usd">
           ≈ {{ store.tip_amount / (store.currency[store.tip_network].usd) }} {{ store.currency[store.tip_network].symbol }}
        </template>
        <template v-else>
          Fail get currency. Please try again later.
        </template>
      </div>
    </el-collapse-transition>
  </section>
</template>

<script setup>
import { ElCollapseTransition, ElInputNumber } from 'element-plus'
import SectionHeader from './section-header'
import useStore from '~~/store';

const store = useStore()
const { $bus } = useNuxtApp()

const props = defineProps({
  modelValue: {
    type: [String, Number]
  }
})

const emits = defineEmits([
  'update:modelValue'
])

onBeforeUnmount(() => {
  $bus.off('reset-tip-form')
})

$bus.on('reset-tip-form', () => {
  customAmount.value = undefined
})

const placeholder = computed(() => {
  if (!store.tip_network) {
    return ''
  } else {
    const currency = store.currency[store.tip_network]
    if (currency && currency.usd) {
      return ` 1${currency.symbol} ≈ $${currency.usd}`
    }
  }
  return ''
})

const activeAmount = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})

const changeAmount = (item) => {
  activeAmount.value = item
  store.setTipAmount(item)
  customAmount.value = undefined
}

const list = [1, 5, 10, 20, 50]
let customAmount = ref(undefined)

const onChangeInput = (value) => {
  if (value) {
    activeAmount.value = value
  }
 
  store.setTipAmount(value)
}

const onBlurInput = (e) => {
  if (customAmount.value === 0) {
    customAmount.value = undefined
  }
}
</script>

<style lang="scss">
.section-amount {
  &__header {
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
  }
  
  &__content {
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    justify-content: space-between;
  }
  
  &__item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: calc((100% - 60px) / 5);
    height: 50px;
    margin-bottom: 15px;
    border: 1px solid var(--border-color);
    border-radius: var(--border-radius);
    font-size: 13px;
    background: var(--fill-color-blank);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover,
    &.active {
      border-color: var(--color-primary);
      box-shadow: 0 0 4px rgba(var(--color-primary-rgb), .5);
    }
  }
  
  &__custom {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 15px;
    margin-bottom: 15px;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    background: var(--fill-color-blank);
    
    &.active {
      border-color: var(--color-primary);
    }
  }
  
  &__custom-input {
    width: 100%;
    
    .el-input__wrapper {
      padding: 0 0 0 5px !important;
      box-shadow: none;
      background: none;
    }
    
    .el-input__inner {
      height: 48px;
      line-height: 48px;
      text-align: left;
      color: var(--text-color-primary);
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .section-amount {
    &__item {
      width: calc((100% - 30px) / 4);
    }
    
    &__custom {
      flex: 1;
      margin-left: 10px;
    }
  }
}
</style>