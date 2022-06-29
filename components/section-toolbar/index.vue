<template>
  <toolbar-skeleton
    v-bind="$attrs"
    :config="toolbarConfig">
    <div
      class="section-toolbar">
      <div
        class="section-toolbar__left">
        <!-- {{ counts }} -->

 <!-- <div
          v-for="item in toolbarConfig"
          :key="item.value"
          
         >
         {{ item.value }}
         {{ counts[`has_${item.value}d`] }}
        </div> -->
        
        <toolbar-item
          v-for="item in toolbarConfig"
          :key="item.value"
          :active="counts[`has_${item.value}d`] && hasLogined"
          :icon="item.icon"
          :count="item.count"
          :value="item.value"
          :show-label="item.showLabel"
          @on-click="emitAction(item)">
        </toolbar-item>
      </div>

      <toolbar-item
        v-if="!hasLogined && showWalletConnect"
        :has-count="false"
        icon="ri-wallet-3-line"
        title="connect wallet"
        @click="$emit('connect-wallet')">
      </toolbar-item>
      
      <template
        v-if="hasLogined && showWalletConnect">
        <el-popover
          :offset="6"
          placement="bottom"
          popper-class="section-toolbar__user-popover"
          :show-arrow="false"
          trigger="click"
          :width="160">
          <template 
            #reference>
            <div
              class="section-toolbar__user">
              <chat-avatar
                class="section-toolbar__user-wallet-icon"
                :alt="loginInfo.screen_name"
                size="small"
                :hash="loginInfo.address"
                :src="loginInfo.avatar || ''">
              </chat-avatar>
              <!-- <img
                class="section-toolbar__user-wallet-icon" 
                :src="loginInfo.avatar" 
                :alt="loginInfo.chain"> -->
              <span
                class="section-toolbar__user-name">
                {{ $formatScreenName(loginInfo.screen_name || loginInfo.address) }}
              </span>
              
              <i
                class="ri-arrow-drop-down-line section-toolbar__user-arrow-icon">
              </i>
            </div>
          </template>
          
          <template 
            #default>
            <menu-item
              icon="ri-refresh-line"
              label="Refresh profile"
              @on-click="$emit('refresh-profile')">
            </menu-item>
            
            <menu-item
              icon="ri-logout-circle-r-line"
              label="Logout"
              @on-click="$emit('logout')">
            </menu-item>
          </template>
        </el-popover>
      </template>
    </div>
  </toolbar-skeleton>
</template>

<script setup>
import { ElPopover } from 'element-plus'
import ToolbarItem from './toolbar-item'
import ToolbarSkeleton from './skeleton'
import useStore from '~~/store'
import useChain from '~~/compositions/chain'

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
  config: {
    type: Object,
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
  if (props.config.modules.length === 1 && (props.config.modules.includes('like-lite') || props.config.modules.includes('dislike-lite'))) {
    return false
  }

  return true
})

const toolbarConfig = computed(() => {
  const list = [{
    active: true,
    icon: 'ri-thumb-up-line',
    value: 'like',
    showLabel: !props.config.modules.includes('dislike') && !props.config.modules.includes('dislike-lite') && !props.config.modules.includes('tip') && !props.config.modules.includes('tip-lite'),
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
    if (props.config.modules.includes(item.value) || props.config.modules.includes(`${item.value}-lite`)) {
      newList.push(item)
    }
  })
  
  return newList
})

const hasLogin = computed(() => {
  const modules = props.config.modules
  let count = 0
  modules.forEach(item => {
    if (item.endsWith('lite')) {
      count++
    }
  })
  
  return modules.length !== count
})
</script>

<style lang="scss">
.section-toolbar {
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
    border-radius: var(--border-radius);
    background: var(--bg-color);
    cursor: pointer;
  }
  
  &__user-popover {
    &.el-popper {
      box-shadow: 0 10px 10px rgba(0, 0, 0, .08);
      border: 0;
      
      .dark & {
        box-shadow: 0 0 0 1px var(--border-color);
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
    color: var(--text-color-primary);
  }
  
  &__user-arrow-icon {
    color: var(--text-color-muted);
  }
}

@media screen and (max-width: $mobile-width) {
  .section-toolbar {
    &__user {
      display: none;
    }
  }
}
</style>