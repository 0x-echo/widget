<template>
  <div
    class="empty-placeholder">
    <i
      class="ri-inbox-line empty-placeholder__icon">
    </i>
    
    <div
      class="empty-placeholder__message">
      {{ message }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  message: {
    type: String,
    default: 'No Data'
  }
})
</script>

<style lang="scss">
.empty-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 30px 0;
  color: var(--text-color-muted);
  opacity: .8;
  
  &__icon {
    font-size: 20px;
  }
  
  &__message {
    font-size: 14px;
  }
}
</style>