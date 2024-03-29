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
        <span 
          class="chat-footer__powerby-label" 
          v-if="!minimal">
          Powered by
        </span>
        
        <span
          style="font-weight: 500;">
          ECHO
        </span>
      </a>
      
      <span
        class="chat-footer__link-divider"
        v-if="/mirror/.test(route.query.target_uri)">
        ·
      </span>
      
      <a
        class="chat-footer__mirror-link"
        v-if="/mirror/.test(route.query.target_uri)"
        href="https://mirror.xyz/0x25f4400Bb5AFa58784F418105EAC61A3cED811Df/7EMVFR066Fq_sOhh6b2eQHkRUH7Dmw7HZy8yppKcrv0"
        target="_blank">
        <span>
          Embed ECHO Widget to My Mirror Entry 
        </span>
          
        <i
          class="ri-arrow-right-up-line">
        </i>
      </a> 
    </div>
    
    <div
      class="chat-footer__right">
      <a 
        class="chat-footer__link chat-footer__privacy-link"
        v-if="!minimal"
        href="https://0xecho.com/privacy"
        target="_blank">
        Privacy Policy
      </a>
      
      <el-popover
        ref="userMenuRef"
        :placement="minimal ? 'top' : 'top-end'"
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
            v-for="item in userMenu"
            :key="item.value"
            :icon="item.icon"
            :is-link="item.isLink"
            :label="item.label"
            :url="item.url"
            @on-click="onClickUserMenu(item)">
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
const route = useRoute()

const props = defineProps({
  minimal: {
    type: Boolean,
    default: false
  }
})

const emits = defineEmits([
  'refresh-profile',
  'logout'
])

const userMenuRef = ref(null)

const userMenu = computed(() => {
  let list = [{
    icon: 'ri-refresh-line',
    label: 'Refresh profile',
    value: 'refresh-profile'
  }, {
    icon: 'ri-logout-circle-r-line',
    label: 'Logout',
    value: 'logout'
  }, {
    icon: 'ri-information-line',
    isLink: true,
    label: 'About ECHO',
    value: 'about-echo',
    url: 'https://0xecho.com/'
  }, {
    icon: 'ri-chat-private-line',
    isLink: true,
    label: 'Privacy Policy',
    value: 'privacy-policy',
    url: 'https://0xecho.com/privacy/'
  }]
  
  if (!hasLogined.value) {
    list.splice(0, 2)
  }
  
  return list
})

const onClickUserMenu = (item) => {
  if (!item.isLink) {
    emits(item.value)
  }
  userMenuRef.value.hide()
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
  
  &__mirror-link {
    display: inline-flex;
    align-items: center;
  }
  
  &__link-divider {
    margin: 0 5px;
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

@media screen and (max-width: #{$tablet-width - 1px}) {
  .chat-footer {
    padding-bottom: 0;
  }
}

@media screen and (max-width: #{$mobile-width - 1px}) {
  .chat-footer {
    align-items: flex-start;
    
    &__link-divider {
      display: none;
    }
    
    &__left {
      flex-direction: column;
      align-items: flex-start;
    }
  }
}

@media screen and (max-width: #{$small-mobile-width - 1px}) {
  .chat-footer {
    &__settings {
      display: block;
    }
    
    &__privacy-link,
    &__powerby-label,
    &__gitcoin {
      display: none;
    }
  }
}
</style>