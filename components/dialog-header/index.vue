<template>
  <div
    class="dialog-header">
    <i
      class="dialog-header__icon"
      :class="icon">
    </i>
    
    <div
      class="dialog-header__title">
      {{ title }}
    </div>
    
    <el-button
      class="dialog-header__close"
      type="info"
      @click="close">
      <i
        class="ri-close-line">
      </i>
    </el-button>
  </div>
</template>

<script setup>
import { ElButton } from 'element-plus'

const props = defineProps({
  icon: {
    type: String
  },
  title: {
    type: String,
    required: true
  }
})

const emits = defineEmits([
  'close'
])

const close = () => {
  emits('close')
}
</script>

<style lang="scss">
.dialog-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
    
  &__icon {
    margin-right: 12px;
    font-size: 24px;
    font-weight: 400;
  }
  
  &__title {
    flex: 1;
    font-size: 18px;
    font-weight: 500;
  }
  
  &__close {
    padding-left: 6px;
    padding-right: 6px;
    margin-left: 12px;
    border-radius: 50%;
    font-size: 18px;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .dialog-header {
    &__icon {
      font-size: 20px;
    }
    
    &__title {
      font-size: 16px;
    }
  }
}
</style>