<template>
  <section
    class="section-user">
    <div
      class="section-user__info">
      <i
        class="ri-arrow-right-s-line section-user__arrow-icon"
        :class="{
          'active': showMore
        }"
        @click="showMore = !showMore">
      </i>
      
      <chat-avatar
        class="section-user__avatar"
        :alt="data.name"
        size="small"
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
    
    <el-collapse-transition>
      <div
        v-show="showMore">
        <div
          class="section-user__more">
          <div
            class="section-user__more-wrapper">
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
        </div>
      </div>
    </el-collapse-transition>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { ElCollapseTransition } from 'element-plus/dist/index.full'

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
  border-radius: var(--border-radius);
  background: var(--bg-color);
  
  &__info {
    display: flex;
    align-items: center;
    padding: 15px 20px;
  }
  
  &__arrow-icon {
    margin-right: 10px;
    font-size: 18px; 
    color: var(--text-color-muted);
    opacity: .8;
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      opacity: 1;
    }
    
    &.active {
      transform: rotate(90deg);
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
    font-size: 14px;
    font-weight: 500;
  }
  
  &__bio {
    margin-top: 4px;
    font-size: 12px;
    color: var(--text-color-muted);
  }
  
  &__more {
    padding: 0 10px 10px;
  }
  
  &__more-wrapper {
    padding: 15px 12px;
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
    width: 14px;
    height: 14px;
    margin-right: 8px;
    object-fit: contain;
  }
  
  &__address {
    font-size: 12px;
    color: var(--text-color-secondary);
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .section-user {
    &__info {
      padding: 10px;
    }
    
    &__bio {
      display: none;
    }
  }
}
</style>