<template>

  <el-dialog
    ref="connectDialogRef"
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
      v-if="store.wallet.loginType === 'login'"
      class="dialog-connect__tip">
      By connecting your wallet and signing a message, you agree to Third.Chat's
      <a
        href="https://third.chat/tos" 
        target="_blank">
        Term's & Conditions
      </a> and 
      <a
        href="https://third.chat/privacy" 
        target="_blank">
        Privacy Policy
      </a>
    </div>

    <div
      v-if="store.wallet.loginType === 'tip'"
      class="dialog-connect__tip">
      Tip: You can use another address to tip the author.
    </div>
  </el-dialog>
</template>

<script setup>
import { ElDialog,  ElLoading } from 'element-plus'
import iconMatemask from '@/assets/metamask.svg'
import iconWalletConnect from '@/assets/walletconnect.svg'
import useStore from '~~/store';

const { $bus } = useNuxtApp()

const store = useStore()
const status = computed((state) => state.status)

const loading = ref(true)

const emits = defineEmits([
  'connect-wallet',
  'update:modelValue'
])

const list = [{
  label: 'MetaMask',
  icon: iconMatemask,
  value: 'metamask'
}, {
  label: 'WalletConnect',
  icon: iconWalletConnect,
  value: 'walletconnect'
}
// {
//   label: 'Fortmatic',
//   icon: iconMatemask,
//   value: '1'
// }
]

$bus.on('show-connect-loading', (text = '') => {
  getLoading(text)
})

$bus.on('hide-connect-loading', () => {
  loadingService.close()
})

const close = () => {
  emits('update:modelValue', false)
}

const connectWallet = (item) => {
  emits('connect-wallet', item)
}

let loadingService
const getLoading = (text) => {
  loadingService = ElLoading.service({
    target: '.dialog-connect',
    text
  }) 
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