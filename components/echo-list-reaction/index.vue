<template>
  <echo-list-reaction-skeleton
    v-bind="$attrs">
    <div
      class="echo-reaction-list">
      <el-tooltip
        :content="tip"
        :disabled="tip === ''"
        placement="top-start">
        <div
          class="echo-reaction-list__value">
          <i
            class="ri-flashlight-fill echo-reaction-list__value-icon">
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

      <div
        class="echo-reaction-list__content">
        <base-user-item
          v-for="item in data"
          :key="item.id"
          :avatar="item.author.avatar || ''"
          :badge="item.times === undefined || item.times === 1 ? '' : `x${item.times}`"
          :address="item.author.address"
          :title="((item.author.address === store.address) ? 'you' : $formatScreenName(item.author.screen_name))">
        </base-user-item>
      </div>
      
      <div
        class="echo-reaction-list__bottom"
        v-if="isLoadingMore">
        <base-loader-pulse>
        </base-loader-pulse>
      </div>
    </div>
  </echo-list-reaction-skeleton>
</template>

<script setup>
import Vue3Autocounter from 'vue3-autocounter'
import { ElButton, ElTooltip } from 'element-plus'
import useStore from '~~/store';

const store = useStore()

const props = defineProps({
  data: {
    type: Array,
    required: true
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
.echo-reaction-list {
  &__value {
    display: inline-flex;
    align-items: center;
    padding: 5px 15px 5px 10px;
    margin-bottom: 28px;
    border-radius: var(--echo-border-radius);
    font-size: 14px;
    font-weight: bold;
    background: rgba(var(--echo-color-warning-rgb), .1);
    color: var(--echo-text-color-secondary);
  }
  
  &__value-icon {
    margin-right: 5px;
    font-size: 18px;
    font-weight: 400;
    color: var(--echo-color-warning);
  }
  
  &__content {
    display: grid;
    grid-template-columns: repeat(auto-fit, 150px);
    gap: 16px 50px;
  }
  
  &__bottom {
    padding: 28px 0;
  }
}

@media screen and (max-width: #{$mobile-width - 1px}) {
  .echo-reaction-list {
    &__content {
      grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
      gap: 16px 12px;
    }
  }
}
</style>