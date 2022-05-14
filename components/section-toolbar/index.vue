<template>
  <toolbar-skeleton
    v-bind="$attrs"
    :config="toolbarConfig">
    <div
      class="section-toolbar">
      <div
        class="section-toolbar__left">
        <toolbar-item
          v-for="item in toolbarConfig"
          :key="item.value"
          :active="item.active"
          :icon="item.icon"
          :count="item.count"
          :value="item.value"
          @on-click="$emit(item.value)">
        </toolbar-item>
      </div>
      
      <template
        v-if="hasLogin">
        <toolbar-item
          :has-count="false"
          icon="ri-wallet-3-line"
          @click="$emit('connect-wallet')">
        </toolbar-item>
        
        <!-- <el-popover
          :offset="0"
          placement="bottom"
          :show-arrow="false"
          trigger="click"
          :width="136">
          <template 
            #reference>
            <div
              class="section-toolbar__user">
              <img
                class="section-toolbar__user-wallet-icon" 
                src="@/assets/metamask.svg" 
                alt="metamask">
                
              <span
                class="section-toolbar__user-name">
                {{ $ellipsisInMiddle('0x1243353533456') }}
              </span>
              
              <i
                class="ri-arrow-drop-down-line section-toolbar__user-arrow-icon">
              </i>
            </div>
          </template>
          
          <template 
            #default>
            <menu-item
              icon="ri-logout-circle-r-line"
              label="Logout"
              @click="$emit('logout')">
            </menu-item>
          </template>
        </el-popover> -->
      </template>
    </div>
  </toolbar-skeleton>
</template>

<script setup>
import { computed } from 'vue'
import { ElPopover } from 'element-plus/dist/index.full'
import ToolbarItem from './toolbar-item'
import ToolbarSkeleton from './skeleton'

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
  'connect-wallet',
  'tip',
  'downvote',
  'logout',
  'upvote'
])

const toolbarConfig = computed(() => {
  const list = [{
    active: true,
    icon: 'ri-thumb-up-line',
    value: 'upvote',
    count: 123
  }, {
    active: false,
    icon: 'ri-thumb-down-line',
    value: 'downvote',
    count: 123
  }, {
    active: false,
    icon: 'ri-money-dollar-circle-line',
    value: 'tip',
    count: 123
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
    width: 136px;
    height: 40px;
    padding: 0 8px 0 12px;
    border-radius: var(--border-radius);
    background: var(--bg-color);
    cursor: pointer;
  }
  
  &__user-wallet-icon {
    width: 20px;
    height: 20px;
    object-fit: contain;
  }
  
  &__user-name {
    flex: 1;
    margin: 0 6px 0 10px;
    font-size: 12px;
    color: var(--text-color-primary);
  }
  
  &__user-arrow-icon {
    color: var(--text-color-muted);
  }
}
</style>