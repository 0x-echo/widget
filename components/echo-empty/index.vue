<template>
  <div
    class="echo-empty">
    <img 
      class="echo-empty__image"
      v-if="store.env.colorTheme === 'light'"
      :alt="message"
      :src="image" >
      
    <img 
      class="echo-empty__image"
      v-if="store.env.colorTheme === 'dark'"
      :alt="message"
      :src="defaultImageDark" >
    
    <div
      class="echo-empty__message"
      v-if="message">
      {{ message }}
    </div>
    
    <slot>
      <el-button
        class="echo-empty__button"
        v-if="buttonText"
        @click="$emit('on-click')">
        <i
          class="echo-empty__button-icon"
          :class="buttonIcon"
          v-if="buttonIcon">
        </i>
        
        <span>
          {{ buttonText }}
        </span>
      </el-button>
    </slot>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus'
import defaultImage from '@/assets/empty.svg'
import defaultImageDark from '@/assets/empty-dark.svg'
import useStore from '~~/store'

const store = useStore()

const props = defineProps({
  buttonIcon: {
    type: String
  },
  buttonText: {
    type: String
  },
  image: {
    type: String,
    default: defaultImage
  },
  imageDark: {
    type: String,
    default: defaultImageDark
  },
  message: {
    type: String,
    default: 'No Data'
  }
})

const emits = defineEmits([
  'on-click'
])
</script>

<style lang="scss">
.echo-empty {
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
  
  &__image {
    width: 50px;
  }
  
  &__message {
    margin-top: 10px;
    font-size: 12px;
  }
  
  &__button {
    margin-top: 20px;
    font-size: 12px;
  }
  
  &__button-icon {
    margin-right: 8px;
    font-size: 14px;
  }
}
</style>