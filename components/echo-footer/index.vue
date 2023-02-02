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
        target="_blank"
        title="Powered by ECHO">
        <span 
          class="echo-footer__powerby-label" 
          v-if="!minimal">
          Powered by 
        </span>
        
        <strong>
          ECHO
        </strong>
      </a>
      
      <!-- <template
        v-if="/mirror/.test(route.query.target_uri)"> -->
        <span
          class="echo-footer__link-divider">
          ·
        </span>
        
        <a 
          class="echo-footer__mirror-link"
          href="https://mirror.xyz/0x25f4400Bb5AFa58784F418105EAC61A3cED811Df/7EMVFR066Fq_sOhh6b2eQHkRUH7Dmw7HZy8yppKcrv0"
          target="_blank"
          title="Embed ECHO Widget to My Mirror Entry">
          <span>
            Embed ECHO Widget to My Mirror Entry
          </span>
          
          <i
            class="ri-arrow-right-up-line">
          </i>
        </a>
      <!-- </template> -->
    </div>
    
    <div
      class="echo-footer__right">
      <a 
        class="echo-footer__link echo-footer__privacy-link"
        v-if="!minimal"
        href="https://0xecho.com/privacy"
        target="_blank">
        Privacy
      </a>
      
      <el-popover
        ref="userMenuRef"
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
          <base-menu-item
            v-for="item in userMenu"
            :key="item.value"
            :icon="item.icon"
            :is-link="item.isLink"
            :label="item.label"
            :url="item.url"
            @on-click="onClickUserMenu(item)">
          </base-menu-item>
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
  
  &__right {
    display: flex;
    align-items: center;
    margin-left: 16px;
  }
  
  &__link {
    color: var(--echo-text-color-muted);
    
    & + .echo-footer__settings {
      margin-left: 5px;
    }
    
    strong {
      font-weight: 500;
    }
  }
  
  &__mirror-link {
    display: inline-flex;
    align-items: center;
  }
  
  &__link-divider {
    margin: 0 5px;
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

@media screen and (max-width: #{$mobile-width - 1px}) {
  .echo-footer {
    align-items: flex-start;
    
    &__left {
      flex-direction: column;
      align-items: flex-start;
    }
    
    &__link-divider {
      display: none;
    }
  }
}

@media screen and (max-width: #{$small-mobile-width - 1px}) {
  .echo-footer {
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