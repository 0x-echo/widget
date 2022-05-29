<template>
  <div
    class="error-page">
    <div
      class="error-page__content">
      <img 
        class="error-page__image"
        src="@/assets/error.svg" 
        alt="Something is wrong">
      
      <h1
        class="error-page__title">
        Something is wrong
      </h1>
    </div>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus'

const props = defineProps({
  error: Object
})
</script>

<style lang="scss">
.error-page {
  padding: 50px 20px;
  
  &__content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  &__image {
    width: 100%;
    max-width: 300px;
  }
  
  &__title {
    margin-top: 10px;
    font-size: 20px;
    text-align: center;
    text-transform: uppercase;
  }
}
</style>