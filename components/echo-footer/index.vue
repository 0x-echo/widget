<template>
  <footer
    class="echo-footer"
    :class="{
      'is-minimal': minimal
    }">
    <div
      class="echo-footer__left">
      <a
        class="echo-footer__link"
        href="https://0xecho.com/"
        target="_blank">
        <template v-if="!minimal">Powered by </template>ECHO 
        <span class="echo-footer__beta-tag">beta</span> 
      </a>
    </div>
    
    <div
      class="echo-footer__right">
      <a 
        class="echo-footer__link"
        v-if="!minimal"
        href="https://0xecho.com/privacy"
        target="_blank">
        Privacy Policy
      </a>
      
      <el-popover
        ref="settingsPopover"
        v-if="hasLogined || minimal"
        :placement="minimal ? 'top' : 'top-end'"
        trigger="click"
        :width="166"
        @before-leave="moreMenuActive = false"
        @show="moreMenuActive = true">
        <template 
          #reference>
          <i
            class="ri-settings-3-line echo-footer__settings">
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
.echo-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  border-top: 1px solid var(--echo-bg-color);
  font-size: 12px;
  line-height: 24px;
  color: var(--echo-text-color-muted);
  
  &.is-minimal {
    border: 0;
    justify-content: center;
    margin: 0;
    
    .echo-footer__settings {
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
    background: var(--echo-color-primary);
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
    color: #16171C;
    
    &:hover {
      background: #14e6b3;
      color: #16171C;
    }
  }
  
  &__gitcoin-logo {
    height: 14px;
    margin-right: 4px;
  }
  
  &__gitcoin-label {
    flex-shrink: 0;
  }
  
  &__right {
    display: flex;
    align-items: center;
    margin-left: 5px;
  }
  
  &__link {
    color: var(--echo-text-color-muted);
    
    & + .echo-footer__settings {
      margin-left: 5px;
    }
  }
  
  &__settings {
    display: none;
    font-size: 16px;
    cursor: pointer;
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .echo-footer {
    padding-bottom: 0;
  }
}

@media screen and (max-width: #{$small-mobile-width - 1px}) {
  .echo-footer {
    &__settings {
      display: block;
    }
    
    &__gitcoin {
      display: none;
    }
  }
}
</style>