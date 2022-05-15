<template>
  <el-dialog
    v-bind="$attrs"
    :close-on-click-modal="false"
    custom-class="dialog-connect"
    :show-close="false"
    width="90%">
    <template
      #title>
      <dialog-header
        icon="ri-wallet-3-line"
        title="Connect Wallet"
        @close="close">
      </dialog-header>
    </template>
    
    <div
      class="dialog-connect__list">
      <wallet-item
        v-for="item in list"
        :key="item.value"
        :data="item"
        @click="connectWallet(item)">
      </wallet-item>
    </div>
    
    <div
      class="dialog-connect__tip">
      By connecting your wallet and signing a message, you agree to third.chat's
      <a
        href="/tos" 
        target="_blank">
        Term's & Conditions
      </a> and 
      <a
        href="/privacy" 
        target="_blank">
        Privacy Policy
      </a>
    </div>
  </el-dialog>
</template>

<script setup>
import { ElDialog } from 'element-plus'
import iconMatemask from '@/assets/metamask.svg'

const emits = defineEmits([
  'connect-wallet',
  'update:modelValue'
])

const list = [{
  label: 'Metamask',
  icon: iconMatemask,
  value: 'metamask'
}, {
  label: 'Wallet Connect',
  icon: iconMatemask,
  value: '1'
}, {
  label: 'Fortmatic',
  icon: iconMatemask,
  value: '1'
}]


const close = () => {
  emits('update:modelValue', false)
}

const connectWallet = (item) => {
  emits('connect-wallet', item)
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>


<style lang="scss">
.dialog-connect {
  &.el-dialog {
    max-width: 485px;
  }
  
  &__list {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
  }
  
  &__tip {
    margin-top: 15px;
    font-size: 12px;
    text-align: center;
    color: var(--text-color-secondary);
  }
}
</style>