<template>
  <footer
    class="chat-footer">
    <div>
      Powered by Third.Chat <span class="chat-footer__beta-tag">beta</span>
    </div>
    
    <div
      class="chat-footer__right">
      <a 
        class="chat-footer__link"
        href=""
        target="_blank">
        Privacy Policy
      </a>
      
      <el-popover
        :offset="0"
        placement="bottom-end"
        :show-arrow="false"
        trigger="click"
        :width="166"
        @before-leave="moreMenuActive = false"
        @show="moreMenuActive = true">
        <template 
          #reference>
          <i
            class="ri-settings-3-line chat-footer__settings">
          </i>
        </template>
        
        <template 
          #default>
          <menu-item
            icon="ri-logout-circle-r-line"
            label="Logout"
            @on-click="$emit('logout')">
          </menu-item>
        </template>
      </el-popover>
    </div>
  </footer>
</template>

<script setup>
import { ElPopover } from 'element-plus'

const setDarkMode = function () {
  document.body.classList.add('dark')
}

const emits = defineEmits([
  'logout'
])
</script>

<style lang="scss">
.chat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin-top: 60px;
  border-top: 1px solid var(--bg-color);
  font-size: 12px;
  color: var(--text-color-muted);
  
  &__beta-tag {
    padding: 2px 4px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 600;
    text-transform: uppercase;
    background: var(--color-primary);
    color: white;
    line-height: 1;
    display: inline-block;
    transform: scale(0.8);
  }
  
  &__right {
    display: flex;
    align-items: center;
  }
  
  &__link {
    color: var(--text-color-muted);
    
    & + .chat-footer__settings {
      margin-left: 5px;
    }
  }
  
  &__settings {
    font-size: 16px;
    cursor: pointer;
  }
}

@media screen and (max-width: #{$small-mobile-width - 1}) {
  .chat-footer {
    flex-direction: column;
    
    &__right {
      margin-top: 5px;
    }
  }
}
</style>