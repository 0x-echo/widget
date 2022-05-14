<template>
  <div
    class="user-item">
    <chat-avatar
      class="user-item__avatar"
      :alt="value"
      :size="36"
      :src="avatar">
    </chat-avatar>
    
    <div
      class="user-item__body">
      <div
        class="user-item__title">
        {{ value }}
      </div>
      
      <div
        class="user-item__subtitle">
        {{ label }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  avatar: {
    type: String,
    required: true
  },
  label: {
    type: String
  },
  value: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss">
.user-item {
  display: flex;
  align-items: center;
  margin: 8px 50px 8px 0;
  
  &__avatar {
    flex-shrink: 0;
    
    & + .user-item__body {
      margin-left: 12px;
    }
  }
  
  &__body {
    flex: 1;
  }
  
  &__title {
    font-size: 14px;
    font-weight: 500;
    color: $text-primary;
  }
  
  &__subtitle {
    font-size: 12px;
    color: $text-muted;
  }
}
</style>