<template>
  <el-popover
    popper-class="profile-popover"
    placement="top"
    trigger="hover"
    :width="260">
    <div
      class="profile-popover__content">
      <chat-avatar
        class="profile-popover__avatar"
        :alt="data.author.screen_name"
        :hash="data.author.address"
        size="default"
        :src="data.author.avatar || ''">
      </chat-avatar>
      
      <div
        class="profile-popover__title ellipsis"
        :title="data.author.screen_name">
        {{ $formatScreenName(data.author.screen_name) }}
      </div>
      
      <div
        class="profile-popover__subtitle"
        :title="data.author.address">
        {{ $ellipsisInMiddle(data.author.address, 6) }}
      </div>
      
      <div
        class="profile-popover__social-list">
        <a 
          class="profile-popover__social-item"
          v-for="item in socials"
          :key="item.title"
          href=""
          rel="noopener noreferrer"
          target="_blank"
          :title="item.title">
          <i
            :class="item.icon">
          </i>
        </a>
      </div>
    </div>
      
    <template
      #reference>
      <slot>
      </slot>
    </template>
  </el-popover>
</template>

<script setup>
import { ElPopover } from 'element-plus'

const props = defineProps({
  data: {
    type: Object,
    required: true
  }
})

const socials = [{
  title: 'Home',
  icon: 'ri-home-4-fill'
}, {
  title: 'Twitter',
  icon: 'ri-twitter-fill'
}, {
  title: 'Github',
  icon: 'ri-github-fill'
}]
</script>

<style lang="scss">
.profile-popover {
  &.el-popper {
    padding: 0; 
  }
    
  &__content {
    position: relative;
    padding: 36px 16px 24px;
    line-height: 1.5;
    text-align: center;
    
    &::before {
      content: '';
      display: block;
      width: 100%;
      height: 60px;
      position: absolute;
      top: 0;
      left: 0;
      border-top-right-radius: var(--border-radius);
      border-top-left-radius: var(--border-radius);
      background: linear-gradient(45deg, var(--color-primary), #5f56c8, #c85697);
      z-index: -1;
    }
  }
  
  
  &__avatar {
    border: 2px solid white;
  }
  
  &__title {
    margin-top: 8px;
    font-size: 14px;
    font-weight: 500;
    color: var(--text-color-primary);
  }
  
  &__subtitle {
    margin-top: 1px;
    font-size: 12px;
    color: var(--text-color-muted);
  }
  
  &__social-list {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 16px;
  }
  
  &__social-item {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background: var(--bg-color);
    font-size: 16px;
    color: var(--text-color-muted);
    
    & + & {
      margin-left: 12px;
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .profile-popover {
    &__avatar {
      --el-avatar-size: 48px;
    }
  }
}
</style>