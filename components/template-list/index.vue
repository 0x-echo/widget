<template>
  <div
    class="chat-widget__container template-list">
    <div
      class="template-list__user">
      <chat-avatar
        class="template-list__user-avatar"
        :alt="data.name"
        :size="80"
        :src="data.avatar">
      </chat-avatar>
      
      <div
        class="template-list__user-name">
        {{ data.name }}
      </div>
      
      <div
        class="template-list__user-bio">
        {{ data.bio }}
      </div>
    </div>
    
    <div
      class="template-list__action-bar">
      <el-button
        class="el-button--xlarge el-button--icon template-list__action-button"
        type="primary">
        <i
          class="ri-thumb-up-line">
        </i>
        
        <span>
          123
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
  
  &__user-name {
    margin-top: 12px;
    font-size: 18px;
    font-weight: 500;
  }
  
  &__user-bio {
    margin-top: 2px;
    font-size: 14px;
    color: $text-muted;
  }
  
  &__action-bar {
    margin-top: 30px;
    text-align: center;
  }
  
  &__action-button {
    width: 200px;
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