<template>
  <echo-module-sole-skeleton
    v-bind="$attrs">
    <div
      class="echo-module-sole">
      <div
        class="echo-module-sole__user">
        <div
          class="echo-module-sole__avatar">
          <echo-avatar
            :alt="store.receiver.name"
            :size="80"
            :src="store.receiver.avatar || ''">
          </echo-avatar>
        </div>
        
        <div
          class="echo-module-sole__user-name">
          {{ store.receiver.displayName || route.query.receiver }}
        </div>
        
        <div
          class="echo-module-sole__bio">
          {{ route.query.desc }}
        </div>
      </div>
      
      <div
        class="echo-module-sole__action">
        <el-button
          class="el-button--xlarge el-button--icon echo-module-sole__action-button"
          :class="{
            active: ((module === 'like' || module === 'dislike') && counts[`has_${module}d`] && store.hasLogined) || module === 'tip'
          }"
          @click="$emit(module, counts[`has_${module}d`])">
          <i
            class="echo-module-sole__action-icon"
            :class="currentModule.icon">
          </i>
          <span>
            <template
              v-if="counts[`${module}_counts`]">
              {{ counts[`${module}_counts`] }} 
            </template>
            <template v-if="module !== 'tip'">
              {{ counts[`${module}_counts`] === 1 ? module : ` ${module}s` }}
            </template>
            <template v-else>
              <template v-if="!counts[`${module}_counts`]">Support</template>
              <template v-else>{{ counts[`${module}_counts`] === 1 ? ' Supporter' : ' Supporters' }}</template>
            </template>
          </span>
        </el-button>
      </div>

      <div
        class="echo-module-sole__stat"
        v-if="(module === 'like' || module === 'dislike') && counts[`${module}_counts`]">
        <el-tooltip
          content="Estimated Total Value of all Liking Address"
          :disabled="module !== 'like'"
          placement="bottom">
          <div
            class="echo-module-sole__stat-value">
            <i
              class="ri-flashlight-fill echo-module-sole__stat-icon">
            </i>
            
            <span>
              {{ ing(module) }} Power: ${{ counts[`${module}_power`] }}
            </span>
          </div>
        </el-tooltip>
      </div>
      
      <div
        class="echo-module-sole__content">
        <div
          class="echo-module-sole__item"
          v-for="item in data[`${module}s`]"
          :key="item.id">
          <el-tooltip
            :content="$formatScreenName(item.author.screen_name) + ((item.author.address === store.address) ? ' (you)' : '')"
            placement="bottom">
            <echo-avatar
              class="echo-module-sole__item-avatar"
              :hash="item.author.address"
              :size="36"
              :src="item.author.avatar || ''">
            </echo-avatar>
          </el-tooltip>
        </div>
      </div>
      
      <echo-footer
        v-bind="$attrs"
        minimal>
      </echo-footer>
    </div>
  </echo-module-sole-skeleton>
</template>

<script setup>
import { ElButton, ElTooltip } from 'element-plus'
import ListSkeleton from './skeleton'
import useStore from '~~/store'

const route = useRoute()
const store = useStore()
const counts = computed(() => store.counts)

const props = defineProps({
  data: {
    type: Object,
    required: true
  },
  module: {
    type: String,
    required: true
  }
})

const ing = (name) => {
  if (/e$/.test(name)) {
    return name.replace(/e$/, 'ing')
  } else {
    return name + 'ing'
  }
}

const length = props.data[`${props.module}s`].length

const currentModule = computed(() => {
  const list = [{
    icon: 'ri-thumb-up-fill',
    value: 'like'
  }, {
    icon: 'ri-thumb-down-fill',
    value: 'dislike'
  }, {
    icon: 'ri-hand-heart-fill',
    value: 'tip'
  }]
  
  return list.find(item => {
    return item.value === props.module
  })
})
</script>

<style lang="scss">
.echo-module-sole {
  
  &__user {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  
  &__avatar {
    display: flex;
    align-items: center;
    width: 100%;
    
    &::before,
    &::after {
      content: '';
      flex: 1;
      height: 1px;
      background: var(--border-color);
    }
    
    &::before {
      margin-right: 30px;
    }
    
    &::after {
      margin-left: 30px;
    }
  }
  
  &__user-name {
    margin-top: 12px;
    font-size: 20px;
    font-weight: 600;
  }
  
  &__bio {
    margin-top: 2px;
    font-size: 14px;
    color: var(--text-color-secondary);
  }
  
  &__action {
    margin-top: 15px;
    text-align: center;

    & + .echo-module-sole__content {
      margin-top: 30px;
    }
  }
  
  &__action-button {
    width: 200px;
    font-weight: 600;
    text-transform: uppercase;
    
    &,
    &:focus:not(.el-button:hover) {
      border-color: var(--color-primary-light);
      background: var(--color-primary-light);
      color: var(--color-primary);
    }
    
    &.active,
    &.active:focus:not(.el-button:hover),
    &:hover,
    &:focus {
      border-color: var(--color-primary);
      background: var(--color-primary);
      color: white;
    }
    
    &.active {
      &:hover {
        border-color: var(--color-primary-dark);
        background: var(--color-primary-dark);
      }
    }
  }
  
  &__action-icon {
    margin-right: 10px;
    font-size: 18px;
    font-weight: 400;
  }
  
  &__stat {
    display: flex;
    align-items: center;
    justify-content: center;
    margin-top: 30px;
    font-size: 12px;
    color: var(--text-color-muted);
    text-transform: capitalize;
    
    &::before,
    &::after {
      content: '';
      width: 15px;
      border-top: 1px dashed var(--border-color);
    }
    
    &::before {
      margin-right: 10px;
    }
    
    &::after {
      margin-left: 10px;
    }
  }
  
  &__stat-value {
    display: flex;
    align-items: center;
  }
  
  &__stat-icon {
    margin-right: 5px;
    font-size: 14px;
    color: var(--color-warning);
  }
  
  &__content {
    display: flex;
    justify-content: center;
    flex-wrap: wrap;
    width: 100%;
    max-width: 416px;
    margin: 7px auto 0;
  }
  
  &__item {
    margin: 8px;
  }
  
  &__item-avatar {
    display: block;
  }
}
</style>