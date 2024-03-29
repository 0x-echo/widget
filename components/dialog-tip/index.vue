<template>
  <el-dialog
    ref="tipDialogRef"
    v-bind="$attrs"
    :close-on-click-modal="false"
    custom-class="dialog-tip"
    :show-close="false"
    top="10vh"
    width="90%"
    @close="onCloseDialog">
    <template
      #header>
      <dialog-header
        icon="ri-hand-heart-line"
        title="Tip"
        @close="close">
      </dialog-header>
    </template>
    
    <section-user
      :data="user">
    </section-user>
    
    <section-network
      v-model="data.network">
    </section-network>

    <section-everpay
      v-if="store.tip_network === 'everpay'"
      v-model:amount="data.everpayAmount"
      v-model:token="data.everpayToken">
    </section-everpay>

    <section-amount
      v-if="data.network && data.network !== 'everpay'"
      v-model="data.amount">
    </section-amount>
  
    <section-wallet
      v-if="data.amount && data.network !== 'everpay'"
      v-model="data.wallet"
      @tip-reconnect="$emit('tip-reconnect')">
    </section-wallet>
    
    <div
      class="dialog-tip__footer">
      <div
        class="dialog-tip__fee-tip">
        * non-refundable; no service fee.
      </div>

      <el-button
        class="dialog-tip__next-button"
        :disabled="data.network === 'everpay' ? (!data.everpayToken || !data.everpayAmount) : (!data.network || !data.amount)"
        size="large"
        type="primary"
        @click="goNext">
        Next
      </el-button>
    </div>
  </el-dialog>
</template>

<script setup>
import { reactive } from 'vue'
import { ElButton, ElCollapseTransition, ElDialog, ElLoading, ElMessage } from 'element-plus'
import SectionAmount from './section-amount'
import SectionEverpay from './section-everpay'
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
  'tip-reconnect'
])

const close = () => {
  emits('update:modelValue', false)
}

const onCloseDialog = () => {
  $bus.emit('reset-tip-form', data.data)
  data.network = ''
  data.everpayToken = '',
  data.everpayAmount = undefined,
  data.amount = undefined
}


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
  everpayToken: '',
  everpayAmount: undefined,
  amount: undefined,
  wallet: ''
})

watch(data, (n) => {
  if (n.network !== 'everpay') {
    data.everpayToken = ''
    data.everpayAmount = undefined
  }
}, {
  deep: true
})

const goNext = () => {
  if (store.tip_network !== 'everpay') {
    if (!store.currency[store.tip_network].usd) {
      ElMessage.error({
        message: 'Fail to get currency. Please try again later.'
      })
      return
    }
  }
  
  // close()
  // emits('go-next', data)

  // everpay max limit
  if (data.network === 'everpay') {
    const tokens = store.tip.availableTokens
    const matched = tokens.find(t => t.tag === data.everpayToken)

    if (!matched) {
      ElMessage.error({
        message: 'Sorry, something went wrong.'
      })
      return
    }
    if (data.everpayAmount * 1 > matched.balance * 1) {
      ElMessage.error({
        message: `Insufficent balance. Max: ${matched.balance}`
      })
      return
    }
  }

  emits('do-tip', data)
} 

const tipDialogRef = ref(null)
const getLoading = () => {
  ElLoading.service({
    target: '.dialog-tip'
  }) 
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>


<style lang="scss">
.dialog-tip {
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
    border: 1px solid var(--border-color);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      border-color: var(--color-primary);
      box-shadow: 0 0 4px rgba(var(--color-primary-rgb), .5);
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
    color: var(--text-color-secondary);
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
  
  &__tip, &__fee-tip {
    font-size: 12px;
    text-align: right;
    color: var(--text-color-muted);
  }

  &__fee-tip {
    margin-right: 10px;
    text-align: left;
  }
  
  &__next-button {
    width: 100px;
  }
}
</style>