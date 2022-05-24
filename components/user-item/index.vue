<template>
  <div
    class="user-item">
    <chat-avatar
      class="user-item__avatar"
      v-if="!badge"
      :alt="title"
      :size="36"
      :hash="address"
      :src="avatar">
    </chat-avatar>
    
    <el-badge 
      class="user-item__badge"
      v-if="badge"
      :value="badge">
      <chat-avatar
        class="user-item__avatar"
        :alt="title"
        :size="36"
        :hash="address"
        :src="avatar">
      </chat-avatar>
    </el-badge>
    
    <div
      class="user-item__body">
      <div
        class="user-item__title ellipsis">
        {{ title }}
      </div>

        <div
          class="user-item__subtitle"
          v-if="subtitle || $slots.subtitle">
          <slot
            name="subtitle">
            {{ subtitle }}
          </slot>
        </div>
    </div>
  </div>
</template>

<script setup>
import { ElBadge } from 'element-plus'

const props = defineProps({
  avatar: {
    type: String,
    required: true
  },
  badge: {
    type: [String, Number]
  },
  subtitle: {
    type: String
  },
  title: {
    type: String,
    required: true
  },
  address: {
    type: String
  }
})
</script>

<style lang="scss">
.user-item {
  display: flex;
  align-items: center;
  width: 150px;
  margin: 8px 50px 8px 0;
  
  &__avatar {
    flex-shrink: 0;
  }
  
  &__body {
    flex: 1;
    min-width: 0;
    margin-left: 12px;
  }
  
  &__title {
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color-primary);
  }
  
  &__subtitle {
    font-size: 12px;
    color: var(--text-color-muted);
  }
}

@media screen and (max-width: #{$mobile-width - 1px}) {
  .user-item {
    width: auto;
    margin-right: 16px;
    
    &__body {
      display: none;
    }
  }
}
</style>