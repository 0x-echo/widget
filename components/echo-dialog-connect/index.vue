<template>
  <base-dialog
    class="echo-dialog-connect"
    title="Connect Wallet"
    title-icon="ri-wallet-3-line"
    @on-close="$emit('update:modelValue', false)">
    <div
      class="echo-dialog-connect__list">
      <base-wallet-item
        class="echo-dialog-connect__item"
        v-for="item in list"
        :key="item.value"
        :icon="item.icon"
        :label="item.label"
        @click="connectWallet(item)">
      </base-wallet-item>
    </div>
    
    <div
      v-if="store.wallet.loginType === 'login'"
      class="echo-dialog-connect__tip">
      By connecting your wallet and signing a message, you agree to 0xecho's
      <a
        href="https://0xecho.com/tos" 
        target="_blank">
        Term's & Conditions
      </a> and 
      <a
        href="https://0xecho.com/privacy" 
        target="_blank">
        Privacy Policy
      </a>
    </div>

    <div
      v-if="store.wallet.loginType === 'tip'"
      class="echo-dialog-connect__tip">
      Tip: You can use another address to tip the author.
    </div>
  </base-dialog>
</template>

<script setup>
import { ElLoading } from 'element-plus'
import iconMatemask from '@/assets/metamask.svg'
import iconWalletConnect from '@/assets/walletconnect.svg'
import iconPhantom from '@/assets/phantom.png'
import iconArconnect from '@/assets/arconnect.png'

import useStore from '~~/store';

const { $bus } = useNuxtApp()

const store = useStore()
const status = computed((state) => state.status)

const loading = ref(true)

const emits = defineEmits([
  'connect-wallet',
  'update:modelValue'
])

const list = computed(() => {
  const list = [{
    label: 'MetaMask',
    icon: iconMatemask,
    value: 'metamask',
    disabled: !window.ethereum
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

  if (store.wallet.loginType === 'login') {
    list.push({
      label: 'Phantom',
      icon: iconPhantom,
      value: 'phantom',
      disabled: !window.solana
    })
  }
  
  list.push({
    label: 'ArConnect',
    icon: iconArconnect,
    value: 'arconnect',
    type: store.env.inIframe ? 'link' : '',
    link: document.location.href + '&action=authorize_arconnect'
  })

  return list
})

$bus.on('show-connect-loading', (text = '') => {
  getLoading(text)
})

$bus.on('hide-connect-loading', () => {
  loadingService && loadingService.close()
})

const close = () => {
  emits('update:modelValue', false)
}

const connectWallet = (item) => {
  if (item.type !== 'link') {
    emits('connect-wallet', item) 
  }
}

let loadingService
const getLoading = (text) => {
  loadingService = ElLoading.service({
    target: '.echo-dialog-connect',
    text
  }) 
}
</script>

<style lang="scss">
.echo-dialog-connect {
  &__list {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 15px;
  }
  
  &__tip {
    margin-top: 30px;
    font-size: 12px;
    text-align: center;
    color: var(--echo-text-color-secondary);
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .echo-dialog-connect {
    &__list {
      grid-template-columns: 1fr;
    }
  }
}
</style>