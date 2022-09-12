<template>
  <footer
    class="chat-footer"
    :class="{
      'is-minimal': minimal
    }">
    <div
      class="chat-footer__left">
      <a
        class="chat-footer__link"
        href="https://0xecho.com/"
        target="_blank">
        <template v-if="!minimal">Powered by </template>ECHO 
        <!-- <span class="chat-footer__beta-tag">beta</span>  -->
      </a>
      
      <a 
        class="chat-footer__gitcoin"
        v-if="!minimal"
        href="https://gitcoin.co/grants/7554/echo-long-live-our-opinion"
        target="_blank"
        title="Support Us on GitCoin">
        <img 
          class="chat-footer__gitcoin-logo"
          src="@/assets/gitcoin.svg" 
          alt="GitCoin">
        
        <span>
          Support
        </span>
        
        <i
          class="ri-arrow-right-up-line">
        </i>
      </a>
    </div>
    
    <div
      class="chat-footer__right">
      <a 
        class="chat-footer__link"
        v-if="!minimal"
        href="https://0xecho.com/privacy"
        target="_blank">
        Privacy Policy
      </a>
      
      <el-popover
        ref="settingsPopover"
        v-if="hasLogined || minimal"
        :placement="minimal ? 'bottom' : 'bottom-end'"
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
            v-if="minimal"
            icon="ri-chat-private-line"
            is-link
            label="Privacy Policy"
            url="https://0xecho.com/privacy/">
          </menu-item>
          
          <menu-item
            v-if="hasLogined"
            icon="ri-logout-circle-r-line"
            label="Logout"
            @on-click="onClickLogout">
          </menu-item>
        </template>
      </el-popover>
    </div>
  </footer>
</template>

<script setup>
import { ElPopover } from 'element-plus'
import useStore from '~~/store'

const setDarkMode = function () {
  document.body.classList.add('dark')
}

const store = useStore()
const hasLogined = computed(() => store.hasLogined)

const props = defineProps({
  minimal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'logout'
])

const settingsPopover = ref(null)
const onClickLogout = () => {
  settingsPopover.value.hide()
  emits('logout')
}
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.chat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-top: 1px solid var(--bg-color);
  font-size: 12px;
  line-height: 24px;
  color: var(--text-color-muted);
  
  &.is-minimal {
    border: 0;
    justify-content: center;
    margin: 0;
    
    .chat-footer__settings {
      display: block;
    }
  }
  
  &__left {
    display: flex;
    align-items: center;
  }
  
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
  
  &__gitcoin {
    display: flex;
    align-items: center;
    padding: 3px 5px;
    margin-left: 5px;
    border-radius: 4px;
    font-size: 12px;
    font-weight: 500;
    line-height: 1;
    background: #15EBB7;
    color: var(--text-color-primary);
    
    &:hover {
      background: #14e6b3;
      color: var(--text-color-primary);
    }
  }
  
  &__gitcoin-logo {
    height: 14px;
    margin-right: 4px;
  }
  
  &__right {
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
  
  &__link {
    color: var(--text-color-muted);
    
    & + .chat-footer__settings {
      margin-left: 5px;
    }
  }
  
  &__settings {
    display: none;
    font-size: 16px;
    cursor: pointer;
  }
}

@media screen and (max-width: $mobile-width) {
  .chat-footer {
    &__settings {
      display: block;
    }
    
    &__gitcoin {
      display: none;
    }
  }
}
</style>