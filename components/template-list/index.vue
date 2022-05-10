<template>
  <div
    class="template-list">
    <div
      class="template-list__user">
      <div
        class="template-list__avatar">
        <chat-avatar
          :alt="data.name"
          :size="80"
          :src="data.avatar">
        </chat-avatar>
      </div>
      
      <div
        class="template-list__user-name">
        {{ data.name }}
      </div>
      
      <div
        class="template-list__bio">
        {{ data.bio }}
      </div>
    </div>
    
    <div
      class="template-list__action">
      <el-button
        class="el-button--xlarge el-button--icon template-list__action-button"
        @click="$emit(module)">
        <i
          class="ri-thumb-up-fill template-list__action-icon">
        </i>
        
        <span>
          <template
            v-if="length">
            {{ length }} 
          </template>
          {{ length ? `${module}s` : module }}
        </span>
      </el-button>
    </div>
    
    <div
      class="template-list__content">
      <div
        class="template-list__item"
        v-for="item in data[`${module}s`]"
        :key="item.id">
        <chat-avatar
          class="template-list__item-avatar"
          :alt="item.name"
          :size="36"
          :src="item.avatar">
        </chat-avatar>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus/dist/index.full'

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  module: {
    type: String,
    required: true
  }
})

const length = props.data[`${props.module}s`].length
</script>

<style lang="scss">
.template-list {
  padding-bottom: 30px;
  
  &__user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  &__avatar {
    display: flex;
    align-items: center;
    width: 100%;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: $bg-color;
    }
    
    &::before {
      margin-right: 30px;
    }
    
    &::after {
      margin-left: 30px;
    }
  }
  
  &__user-name {
    margin-top: 12px;
    font-size: 20px;
    font-weight: 600;
  }
  
  &__bio {
    margin-top: 2px;
    font-size: 14px;
    color: $text-muted;
  }
  
  &__action {
    margin-top: 30px;
    text-align: center;
  }
  
  &__action-button {
    padding-left: 30px;
    padding-right: 30px;
    font-weight: 600;
    
    text-transform: uppercase;
    
    &,
    &:focus:not(.el-button:hover) {
      border-color: #e9effe;
      background: #e9effe;
      color: $primary;
    }
    
    &.active,
    &:hover,
    &:focus {
      border-color: $primary;
      background: $primary;
      color: white;
    }
  }
  
  &__action-icon {
    margin-right: 10px;
    font-size: 18px;
    font-weight: 400;
  }
  
  &__content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    margin-top: 45px;
  }
  
  &__item {
    & + & {
      margin-left: 15px;
    }
  }
  
  &__item-avatar {
    display: block;
  }
}
</style>