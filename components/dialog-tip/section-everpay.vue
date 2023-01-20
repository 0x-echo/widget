<template>
  <section
    class="section-everpay">
    <section
      class="section-everpay-token">
      <section-header
        title="Choose Token">
      </section-header>
      
      <div
        class="section-everpay-token__content">
        <pulse-loader
          v-if="store.tip.onFetchingEverPay">
        </pulse-loader>
        
        <div
          class="section-everpay-token__list"
          v-if="!store.tip.onFetchingEverPay && store.tip.availableTokens.length">
          <div
            class="section-everpay-token__item"
            :class="{
              'active': token.chainType === activeToken
            }"
            v-for="token in store.tip.availableTokens" 
            :key="token.tag"
            @click="changeToken(token)">
            <img 
              class="section-everpay-token__item-logo"
              :src="'/token_assets/' + token.symbol.toLowerCase() + '.png'">
              
            <span
              class="section-everpay-token__item-label">
              {{ (token.balance * 1).toFixed(6) }} {{ token.symbol }}
            </span>
          </div>
        </div>
        
        <div 
          class="section-everpay-token__tip"
          v-if="!store.tip.onFetchingEverPay && !store.tip.availableTokens.length">
          No Available Everpay Assets 
        </div>
      </div>
    </section>
    
    <section
      class="section-everpay-amount"
      v-if="activeToken">
      <section-header
        title="Enter Amount">
      </section-header>
      
      <div
        class="section-everpay-amount__input">
        <el-input-number
          class="section-everpay-amount__input-inner"
          v-model="currentAmount"
          :controls="false"
          :min="0.000001"
          :precision="6"
          size="large"
          @input="onChangeAmountInput"
          @blur="onBlurAmountInput" />
          
        <span>
          {{ store.tip.availableTokens.length ? store.tip.availableTokens.filter(item => { return item.chainType === activeToken })[0].symbol : '' }}
        </span>
      </div>
    </section>
  </section>
</template>

<script setup>
import { ElInputNumber } from 'element-plus'
import SectionHeader from './section-header'

import useStore from '~~/store'

const store = useStore()

const props = defineProps({
  amount: {
    type: [String, Number]
  },
  token: {
    type: [String, Number]
  }
})

const emits = defineEmits([
  'update:amount',
  'update:token'
])

const currentAmount = computed({
  get: () => {
    return props.amount
  },
  set: (val) => {
    emits('update:amount', val)
  }
})

const activeToken = computed({
  get: () => {
    return props.token
  },
  set: (val) => {
    emits('update:token', val)
  }
})

const changeToken = (token) => {
  activeToken.value = token.chainType
}

const onChangeAmountInput = (value) => {
  if (value) {
    currentAmount.value = value
  }
}

const onBlurAmountInput = (e) => {
  if (currentAmount.value === 0) {
    currentAmount.value = undefined
  }
}
</script>

<style lang="scss">
.section-everpay-token {
  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  &__item {
    display: flex;
    align-items: center;
    height: 50px;
    padding: 0 20px;
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
  
  &__item-logo {
    width: 24px;
    
    + .section-everpay-token__item-label {
      margin-left: 10px;
    }
  }
  
  &__item-label {
    font-size: 13px;
  }
  
  &__tip {
    font-size: 12px;
    text-align: center;
    color: var(--text-color-secondary);
  }
}

.section-everpay-amount {
  &__input {
    display: flex;
    align-items: center;
    width: 100%;
    height: 50px;
    padding: 0 15px;
    margin-bottom: 15px;
    border-radius: var(--border-radius);
    border: 1px solid var(--border-color);
    background: var(--fill-color-blank);
  }
  
  &__input-inner {
    flex: 1;
    
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
  .section-everpay-token {
    &__list {
      grid-template-columns: 1fr;
    }
  }
}
</style>