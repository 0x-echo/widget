<template>
  <echo-toolbar-skeleton
    v-bind="$attrs"
    :config="toolbarConfig"
    :show-right="showWalletConnect">
    <div
      class="echo-toolbar">
      <div
        class="echo-toolbar__left">
        <echo-toolbar-item
          v-for="item in toolbarConfig"
          :key="item.value"
          :active="counts[`has_${item.value}d`] && hasLogined"
          :icon="item.icon"
          :count="item.count"
          :value="item.value"
          :show-label="item.showLabel"
          @on-click="emitAction(item)">
        </echo-toolbar-item>
      </div>

      <echo-toolbar-item
        class="echo-toolbar__connect-button"
        v-if="!hasLogined && showWalletConnect"
        :has-count="false"
        icon="ri-wallet-3-line"
        title="connect wallet"
        @click="$emit('connect-wallet')">
      </echo-toolbar-item>
      
      <template
        v-if="hasLogined && showWalletConnect">
        <el-popover
          ref="userMenuRef"
          :offset="6"
          placement="bottom"
          popper-class="echo-toolbar__user-popover"
          :show-arrow="false"
          trigger="click"
          :width="160">
          <template 
            #reference>
            <div
              class="echo-toolbar__user">
              <base-avatar
                class="echo-toolbar__user-wallet-icon"
                :alt="loginInfo.screen_name"
                size="small"
                :hash="loginInfo.address"
                :src="loginInfo.avatar || ''">
              </base-avatar>
             
              <span
                class="echo-toolbar__user-name">
                {{ $formatScreenName(loginInfo.screen_name || loginInfo.address) }}
              </span>
              
              <i
                class="ri-arrow-drop-down-line echo-toolbar__user-arrow-icon">
              </i>
            </div>
          </template>
          
          <template 
            #default>
            <base-menu-item
              v-for="item in userMenu"
              :key="item.value"
              :icon="item.icon"
              :is-link="item.isLink"
              :label="item.label"
              :url="item.url"
              @on-click="onClickUserMenu(item)">
            </base-menu-item>
          </template>
        </el-popover>
      </template>
    </div>
  </echo-toolbar-skeleton>
</template>

<script setup>
import { ElPopover } from 'element-plus'
import useStore from '~~/store'
import useChain from '~~/compositions/chain'

// import * as Dotbit from 'dotbit/lib/index'
// console.log(Dotbit)
// const { createInstance, ProviderSigner, BitNetwork } = Dotbit
// const signer = new ProviderSigner(window.ethereum)
// const dotbit = createInstance({
//   network: BitNetwork.testnet,
//   signer
// })

// const bitAccount = dotbit.account('ec009.imac.bit')
// console.log(bitAccount)

const { logos, defaultLogo } = useChain()

const store = useStore()
const counts = computed(() => store.counts)
const hasLogined = computed(() => store.hasLogined)
const loginInfo = computed(() => {
  return {
    chain: store.chain,
    address: store.address,
    screen_name: store.screen_name,
    avatar: store.avatar
  }
})

const props = defineProps({
  modules: {
    type: Array,
    required: true
  },
  user: {
    type: Object
  }
})

const emits = defineEmits([
  'refresh-profile',
  'connect-wallet',
  'tip',
  'dislike',
  'logout',
  'like',
  'ilike'
])

// @todo use ilike instead of like because there is a bug
const emitAction = (item) => {
  emits(item.value === 'like' ? 'ilike' : item.value, counts.value[`has_${item.value}d`])
}

const showWalletConnect = computed(() => {
  if (props.modules.length === 1 && (props.modules.includes('like-lite') || props.modules.includes('dislike-lite'))) {
    return false
  }

  return true
})

const toolbarConfig = computed(() => {
  const list = [{
    active: true,
    icon: 'ri-thumb-up-line',
    value: 'like',
    showLabel: !props.modules.includes('dislike') && !props.modules.includes('dislike-lite') && !props.modules.includes('tip') && !props.modules.includes('tip-lite'),
    count: store.counts.like_counts
  }, {
    active: false,
    icon: 'ri-thumb-down-line',
    value: 'dislike',
    count: store.counts.dislike_counts
  }, {
    active: false,
    icon: 'ri-money-dollar-circle-line',
    value: 'tip',
    count: store.counts.uniq_supporter_counts
  }]
  
  let newList = []
  list.forEach(item => {
    if (props.modules.includes(item.value) || props.modules.includes(`${item.value}-lite`)) {
      newList.push(item)
    }
  })
  
  return newList
})

const hasLogin = computed(() => {
  const modules = props.modules
  let count = 0
  modules.forEach(item => {
    if (item.endsWith('lite')) {
      count++
    }
  })
  
  return modules.length !== count
})

const userMenu = [{
  icon: 'ri-refresh-line',
  label: 'Refresh profile',
  value: 'refresh-profile'
}, {
  icon: 'ri-logout-circle-r-line',
  label: 'Logout',
  value: 'logout'
}, {
  icon: 'ri-information-line',
  isLink: true,
  label: 'About ECHO',
  value: 'about-echo',
  url: 'https://0xecho.com/'
}]

const userMenuRef = ref(null)
const onClickUserMenu = (item) => {
  if (!item.isLink) {
    emits(item.value)
  }
  userMenuRef.value.hide()
}
</script>

<style lang="scss">
.echo-toolbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 30px;
  
  &__left {
    display: flex;
    align-items: center;
  }
  
  &__user {
    display: flex;
    align-items: center;
    min-width: 140px;
    max-width: 160px;
    height: 40px;
    padding: 0 8px 0 12px;
    border-radius: var(--echo-border-radius);
    background: var(--echo-bg-color);
    cursor: pointer;
  }
  
  &__user-popover {
    &.el-popper {
      box-shadow: 0 10px 10px rgba(0, 0, 0, .08);
      border: 0;
      
      .dark & {
        box-shadow: 0 0 0 1px var(--echo-border-color);
      }
    }
  }
  
  &__user-wallet-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
    border-radius: 50%;
  }
  
  &__user-name {
    flex: 1;
    margin: 0 6px 0 8px;
    font-size: 12px;
    color: var(--echo-text-color-primary);
  }
  
  &__user-arrow-icon {
    color: var(--echo-text-color-muted);
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .echo-toolbar {
    &__user {
      width: 40px;
      min-width: inherit;
      max-width: inherit;
      padding: 0 10px;
    }
    
    &__user-name,
    &__user-arrow-icon {
      display: none;
    }
  }
}

@media screen and (max-width: #{$small-mobile-width - 1px}) {
  .echo-toolbar {
    &__user,
    &__connect-button {
      display: none;
    }
  }
  
  .echo-toolbar-item + .echo-toolbar-item {
    margin-left: 8px;
  }
}
</style>