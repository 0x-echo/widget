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
        <base-wallet-item
          class="section-wallet__item"
          v-for="item in store.wallet.connectedWallets"
          :key="item"
          :active="item === store.wallet.tipWallet"
          direction="row"
          :label="item"
          @click="changeOption(item)">
          {{ $ellipsisInMiddle(item, 6) }}
        </base-wallet-item>
        
        <div
          v-if="store.wallet.loginApp === 'metamask'"
          class="base-wallet-item section-wallet__item section-wallet__add"
          @click="reselectWallet">
          <i
            class="ri-edit-2-line">
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
  'update:modelValue',
  'choose-tip-wallet'
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
  activeOption.value = item
  store.setData('wallet', {
    tipWallet: item
  })
}

const reselectWallet = async () => {
  store.setWallet({
    loginType: 'reselect'
  })
  emits('choose-tip-wallet')
  // const rs = await window.ethereum.request({
  //   method: "wallet_requestPermissions",
  //   params: [
  //     {
  //       eth_accounts: {}
  //     }
  //   ]
  // })
  // if (store.wallet.connectedWallets[0]) {
  //   store.setData('wallet', {
  //     tipWallet: store.wallet.connectedWallets[0]
  //   })
  // }
}

onMounted(async () => {
  console.log('wallet mounted')
  console.log(store.wallet)
  // const accounts = await ethereum.request({ method: 'eth_accounts' })
  // console.log(accounts)
  // auto-select current wallet
  if (store.wallet.connectedWallets[0]) {
    store.setData('wallet', {
      tipWallet: store.wallet.connectedWallets[0]
    })
  }
})
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
    flex-shrink: 1;
    width: 150px;
    
    & + & {
      margin-left: 15px;
    }
  }
  
  &__add {
    width: 44px;
    height: 44px;
    padding: 0;
    font-size: 16px;
    color: var(--echo-text-color-muted);
    
    &:hover {
      color: var(--echo-text-color-secondary);
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .section-wallet {
    &__item {      
      & + & {
        margin-left: 10px;
      }
    }
  }
}
</style>