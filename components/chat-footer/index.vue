<template>
  <footer
    class="chat-footer"
    :class="{
      'is-minimal': minimal
    }">
    <div>
      <template v-if="!minimal">Powered by </template>ECHO <span class="chat-footer__beta-tag">beta</span>
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
        :offset="0"
        :placement="minimal ? 'bottom' : 'bottom-end'"
        :show-arrow="false"
        trigger="click"
        :width="166"
        @before-leave="moreMenuActive = false"
        @show="moreMenuActive = true">
        <template 
          #reference>
          <i
            class="ri-settings-3-line chat-footer__settings"
            v-if="hasLogined || minimal">
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

<style lang="scss">
.chat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin-top: 60px;
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
    display: none;
    font-size: 16px;
    cursor: pointer;
  }
}

@media screen and (max-width: #{$small-mobile-width - 1px}) {
  .chat-footer {
    flex-direction: column;
    
    &__right {
      margin-top: 5px;
    }
  }
}

@media screen and (max-width: $mobile-width) {
  .chat-footer {
    &__settings {
      display: block;
    }
  }
}
</style>