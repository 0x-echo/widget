<template>
  <div
    class="error-page">
    <div
      class="error-page__content">
      <img 
        class="error-page__image"
        v-if="store.env.colorTheme === 'light'"
        src="@/assets/error.svg" 
        alt="Something is wrong">
        
      <img 
        class="error-page__image"
        v-if="store.env.colorTheme === 'dark'"
        src="@/assets/error-dark.svg" 
        alt="Something is wrong">
      
      <h1
        class="error-page__title">
        {{ $route.query.error || 'Something is wrong' }}
      </h1>
    </div>
  </div>
</template>

<script setup>
import useStore from '~~/store'
// import useWidgetConfig from '~~/compositions/widget-config'

// TODO - get color theme 
const store = useStore()
// const { config } = useWidgetConfig(store)
// store.setWidgetConfig(config)

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