<template>
  <section
    class="section-user">
    <div
      class="section-user__info">
      <i
        class="ri-arrow-right-s-line section-user__arrow-icon"
        @click="showMore = !showMore">
      </i>
      
      <chat-avatar
        class="section-user__avatar"
        :alt="data.name"
        :size="36"
        :src="data.avatar">
      </chat-avatar>
      
      <div
        class="section-user__content">
        <div
          class="section-user__name">
          {{ data.name }}
        </div>
        
        <div
          class="section-user__bio">
          {{ data.bio }}
        </div>
      </div>
    </div>
    
    <div
      class="section-user__more"
      v-show="showMore">
      <div
        class="section-user__more-item"
        v-for="item in data.wallet"
        :key="item.type">
        <img 
          class="section-user__wallet-icon"
          :alt="item.type"
          src="@/assets/default-avatar.svg">
          
        <span
          class="section-user__address">
          {{ item.address }}
        </span>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElCollapse } from 'element-plus/dist/index.full'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const showMore = ref(false)
</script>

<style lang="scss">
.section-user {
  padding: 10px;
  border-radius: $border-radius;
  background: $bg-color;
  
  &__info {
    display: flex;
    align-items: center;
    padding: 5px 10px;
    
    & + .section-user__more {
      margin-top: 10px;
    }
  }
  
  &__arrow-icon {
    margin-right: 10px;
    font-size: 18px; 
    color: $text-muted;
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      color: $primary;
    }
  }
  
  &__avatar {
    flex-shrink: 0;
    margin-right: 12px;
  }
  
  &__content {
    flex: 1;
    line-height: 1;
  }
  
  &__name {
    font-size: 16px;
    font-weight: 500;
  }
  
  &__bio {
    margin-top: 4px;
    font-size: 12px;
    color: $text-muted;
  }
  
  &__more {
    padding: 15px 20px 15px 18px;
    margin-left: 28px;
    border-radius: 10px;
    background: white;
  }
  
  &__more-item {
    display: flex;
    align-items: center;
    
    & + & {
      margin-top: 10px;
    }
  }
  
  &__wallet-icon {
    width: 20px;
    height: 20px;
    margin-right: 12px;
  }
  
  &__address {
    font-size: 12px;
    color: $text-secondary;
  }
}
</style>