<template>
  <div
    class="notification-item">
    <base-avatar
      class="notification-item__avatar"
      :alt="data.author.screen_name"
      size="small"
      :hash="data.author.address"
      :src="data.author.avatar || ''">
    </base-avatar>
    
    <div
      class="notifcation-item__body">
      <div
        class="notification-item__title">
        <strong>{{ data.author.screen_name }}</strong> {{ data.type }}
      </div>
      
      <div
        class="notification-item__meta">
        {{ data.created_at }}
      </div>
      
      <div
        class="notification-item__content">
        {{ data.content }}
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})
</script>

<style lang="scss">
.notification-item {
  display: flex;
  padding: 16px 12px; 
  border-radius: var(--echo-border-radius);
  cursor: pointer;
  transition: all .3s ease;
  
  // & + & {
  //   border-top: 1px dashed var(--echo-border-color);
  // }
  
  &:hover {
    background: var(--echo-bg-color);
  }
  
  &__avatar {
    flex-shrink: 0;
    margin-right: 12px;
  }
  
  &__body {
    flex: 1;
  }
  
  &__title {
    font-size: 14px;
    
    strong {
      font-weight: 500;
    }
  }
  
  &__meta {
    font-size: 12px;
    color: var(--echo-text-color-muted);
  }
  
  &__content {
    margin-top: 8px;
    font-size: 14px;
    color: var(--echo-text-color-primary);
  }
}
</style>