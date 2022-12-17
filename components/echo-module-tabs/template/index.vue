<template>
  <echo-module-tabs-template-skeleton
    v-bind="$attrs">
    <div
      class="echo-module-tabs-template"
      v-if="showList">
      <div
        v-if="powerValue">
        <el-tooltip
          :content="tip"
          :disabled="tip === ''"
          placement="top-start">
          <div
            class="echo-module-tabs-template__value">
            <i
              class="ri-flashlight-fill echo-module-tabs-template__value-icon">
            </i>

            <span>
              {{ powerLabel }}: $<vue3-autocounter
                ref="counterRef"
                autoinit
                :duration="1"
                :startAmount="store.widgetConfig.modules[0] === module ? powerValue : 0"
                :endAmount="powerValue"
                separator=",">
              </vue3-autocounter>
            </span>

          </div>
        </el-tooltip>
      </div>

      <div
        class="echo-module-tabs-template__list">
        <slot>
        </slot>
      </div>
      
      <div
        class="echo-module-tabs-template__bottom"
        v-if="hasMore">
        <el-button
          class="echo-module-tabs-template__more-button"
          v-if="!isLoadingMore"
          size="small"
          type="info"
          @click="$emit('load-more')">
          Load More
        </el-button>
        
        <echo-pulse-loader
          v-if="isLoadingMore">
        </echo-pulse-loader>
      </div>
    </div>
  </echo-module-tabs-template-skeleton>
</template>

<script setup>
import Vue3Autocounter from 'vue3-autocounter'
import { ElButton, ElTooltip } from 'element-plus'
import useStore from '~~/store';

const store = useStore()

const props = defineProps({
  hasMore: {
    type: Boolean,
    default: false
  },
  isLoadingMore: {
    type: Boolean,
    default: false
  },
  module: {
    type: String
  },
  powerLabel: {
    type: String
  },
  powerValue: {
    type: [String, Number]
  },
  tip: {
    type: String
  },
  showList: {
    type: Boolean
  }
})

const currentTab = computed(() => store.layout.currentTab)
const counterRef = ref(null)
const animationDone = ref(false)
watch(currentTab, (newVal, oldVal) => {
  if (newVal === props.module && counterRef.value && !animationDone.value) {
    counterRef.value.start()
    animationDone.value = true
  }
})
</script>

<style lang="scss">
.echo-module-tabs-template {
  padding: 0 20px 40px;
  
  &__value {
    display: inline-flex;
    align-items: center;
    padding: 5px 15px 5px 10px;
    margin-bottom: 28px;
    border-radius: var(--border-radius);
    font-size: 14px;
    font-weight: bold;
    background: rgba(var(--color-warning-rgb), .1);
    color: var(--text-color-secondary);
  }
  
  &__value-icon {
    margin-right: 5px;
    font-size: 18px;
    font-weight: 400;
    color: var(--color-warning);
  }
  
  &__list {
    display: grid;
    grid-template-columns: repeat(auto-fit, 150px);
    gap: 16px 50px;
  }
  
  &__bottom {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 28px 0;
  }
  
  &__more-button {
    .dark & {
      &.active,
      &:hover,
      &:focus,
      &:focus:not(.el-button:hover) {
        color: white;
        background-clip: padding-box;
      }
    }
  }
}

@media screen and (max-width: #{$mobile-width - 1px}) {
  .echo-module-tabs-template {
    &__list {
      grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
      gap: 16px 12px;
    }
  }
}
</style>