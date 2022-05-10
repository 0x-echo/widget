<template>
  <div
    class="section-toolbar">
    <div
      class="section-toolbar__left">
      <toolbar-item
        v-for="item in config"
        :key="item.value"
        :active="item.active"
        :icon="item.icon"
        :count="item.count"
        :value="item.value"
        @on-click="$emit(item.value)">
      </toolbar-item>
    </div>
    
    <!-- <toolbar-item
      icon="ri-wallet-3-line"
      @click="$emit('connect-wallet')">
    </toolbar-item> -->
    
    <el-popover
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
    </el-popover>
  </div>
</template>

<script setup>
import { ElPopover } from 'element-plus/dist/index.full'
import ToolbarItem from './toolbar-item'

const props = defineProps({
  config: {
    type: Array,
    required: true
  },
  user: {
    type: Object
  }
})

const emits = defineEmits([
  'connect-wallet',
  'donate',
  'downvote',
  'logout',
  'upvote'
])
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
    border-radius: $border-radius;
    background: $bg-color;
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
    color: $text-primary;
  }
  
  &__user-arrow-icon {
    color: $text-muted;
  }
}
</style>