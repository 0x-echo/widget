<template>
  <div
    class="chat-tabs">
    <div
      class="chat-tabs__item"
      :class="{
        'active': item.value === activeTab
      }"
      v-for="item in tabs"
      :key="item.value"
      @click="activeTab = item.value">
      <template v-if="item.count">{{ item.count }}</template> {{ item.label }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  modelValue: {
    type: String
  },
  tabs: {
    type: Array,
    required: true
  }
})

const emits = defineEmits([
  'update:modelValue'
])

const activeTab = computed({
  get: () => {
    return props.modelValue
  },
  set: (val) => {
    emits('update:modelValue', val)
  }
})
</script>

<style lang="scss">
.chat-tabs {
  position: relative;
  display: flex; 
  margin-bottom: 30px;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background: $bg-color;
  }
  
  &__item {
    position: relative;
    display: flex;
    align-items: center;
    height: 40px;
    padding: 0 20px;
    font-size: 14px;
    color: $text-muted;
    cursor: pointer;
    transition: all .3s ease;
    
    &::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: $primary;
      opacity: 0;
      transform: scale3d(0, 1, 1);
      transition: all .3s ease;
      z-index: 1;
    }
    
    &.active {
      color: $text-primary;
      
      &::after {
        opacity: 1;
        transform: scale3d(1, 1, 1);
      }
    }
    
    &:hover {
      color: $text-primary;
    }
  }
}
</style>
