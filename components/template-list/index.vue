<template>
  <list-skeleton
    v-bind="$attrs">
    <div
      class="template-list">
      <div
        class="template-list__user">
        <div
          class="template-list__avatar">
          <chat-avatar
            :alt="data.name"
            :size="80"
            :src="data.avatar || ''">
          </chat-avatar>
        </div>
        
        <div
          class="template-list__user-name">
          {{ data.name }}
        </div>
        
        <div
          class="template-list__bio">
          {{ data.bio }}
        </div>
      </div>
      
      <div
        class="template-list__action">
        <el-button
          class="el-button--xlarge el-button--icon template-list__action-button"
          :class="{
            active: ((module === 'like' || module === 'dislike') && counts[`has_${module}d`] && store.hasLogined) || module === 'tip'
          }"
          @click="$emit(module, counts[`has_${module}d`])">
          <i
            class="template-list__action-icon"
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
              {{ counts[`${module}_counts`] === 1 ? ' Supporter' : ' Supporters' }}
            </template>
          </span>
        </el-button>
      </div>

      <div
        class="template-list__stat"
        v-if="module === 'like' && counts[`${module}_counts`]">
        <el-tooltip
          content="Estimated Total Value of all Liking Address"
          :disabled="module !== 'like'"
          placement="bottom">
          <div
            class="template-list__stat-value">
            <i
              class="ri-flashlight-fill template-list__stat-icon">
            </i>
            
            <span>
              {{ ing(module) }} Power: ${{ counts.like_power }}
            </span>
          </div>
        </el-tooltip>
      </div>
      
      <div
        class="template-list__content">
        <div
          class="template-list__item"
          v-for="item in data[`${module}s`]"
          :key="item.id">
          <el-tooltip
            :content="$formatScreenName(item.author.screen_name) + ((item.author.address === store.address) ? ' (you)' : '')"
            placement="bottom">
            <chat-avatar
              class="template-list__item-avatar"
              :hash="item.author.address"
              :size="36"
              :src="item.author.avatar || ''">
            </chat-avatar>
          </el-tooltip>
        </div>
      </div>
      
      <chat-footer
        v-bind="$attrs"
        minimal>
      </chat-footer>
    </div>
  </list-skeleton>
</template>

<script setup>
import { ElButton, ElTooltip } from 'element-plus'
import ListSkeleton from './skeleton'
import useStore from '~~/store'


const store = useStore();
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
.template-list {
  
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

    & + .template-list__content {
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