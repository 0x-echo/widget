<template>
  <base-dialog
    class="echo-dialog-tip"
    title="Tip"
    title-icon="ri-hand-heart-line"
    @close="close"
    @on-close="$emit('update:modelValue', false)">
    <section-user
      :data="user">
    </section-user>
    
    <section-network
      v-model="data.network">
    </section-network>
    
    <el-collapse-transition>
      <section-amount
        v-show="data.network"
        v-model="data.amount">
      </section-amount>
    </el-collapse-transition>
    
    <el-collapse-transition>
      <section-wallet
        v-if="data.amount"
        v-model="data.wallet"
        @choose-tip-wallet="$emit('choose-tip-wallet')">
      </section-wallet>
    </el-collapse-transition>
    
    <div
      class="echo-dialog-tip__footer">
      <div
        class="echo-dialog-tip__fee-tip">
        * non-refundable; no service fee.
      </div>

      <el-button
        class="echo-dialog-tip__next-button"
        :disabled="!(data.network && data.amount)"
        size="large"
        type="primary"
        @click="goNext">
        Next
      </el-button>
    </div>
  </base-dialog>
</template>

<script setup>
import { ElButton, ElCollapseTransition, ElLoading } from 'element-plus'
import { echoMessage } from "~~/libs/helper"
import SectionAmount from './section-amount'
import SectionNetwork from './section-network'
import SectionUser from './section-user'
import SectionWallet from './section-wallet'

import useStore from '~~/store';

const store = useStore()
const { $bus } = useNuxtApp()

const route = useRoute()

const emits = defineEmits([
  'go-next',
  'update:modelValue',
  'do-tip',
  'choose-tip-wallet'
])

const user = computed(() => ({
  name: store.receiver.displayName,
  bio: route.query.desc,
  avatar: store.receiver.avatar,
  wallet: [{
    chain: 'EVM/1',
    address: store.receiver.address
  }, {
    chain: 'EVM/137',
    address: store.receiver.address
  }, {
    chain: 'EVM/56',
    address: store.receiver.address
  }]
}))

let data = reactive({
  network: '',
  amount: '',
  wallet: ''
})

const close = () => {
  $bus.emit('reset-tip-form')
  data.network = ''
  data.amount = ''
}

const goNext = () => {
  if (!store.currency[store.tip_network].usd) {
    echoMessage.error({
      message: 'Fail to get currency. Please try again later.'
    })
    return
  }

  emits('do-tip', data)
} 

const getLoading = () => {
  ElLoading.service({
    target: '.echo-dialog-tip'
  }) 
}
</script>

<style lang="scss">
.echo-dialog-tip {
  &.el-dialog {
    max-width: 580px;
  }
  
  section + section {
    margin-top: 30px;
  }
  
  &__section-header {
    margin-bottom: 20px;
  }
  
  &__section-title {
    font-size: 13px;
    font-weight: 600;
  }
  
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  &__item {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    width: calc((100% - 15px) / 2);
    padding: 15px 15px 12px;
    margin-bottom: 15px;
    border-radius: 12px;
    background: white;
    border: 1px solid var(--echo-border-color);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      border-color: var(--echo-color-primary);
      box-shadow: 0 0 4px rgba(var(--echo-color-primary-rgb), .5);
    }
  }
  
  &__item-logo {
    width: 24px;
    height: 24px;
    object-fit: contain;
  }
  
  &__item-label {
    margin-top: 6px;
    font-size: 14px;
    font-weight: 500;
    color: var(--echo-text-color-secondary);
  }
  
  &__item-tag {
    margin-left: 10px;
  }
  
  &__footer {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-top: 30px;
  }
  
  &__tip, 
  &__fee-tip {
    font-size: 12px;
    text-align: right;
    color: var(--echo-text-color-muted);
  }

  &__fee-tip {
    text-align: left;
  }
  
  &__next-button {
    width: 100px;
  }
}
</style>