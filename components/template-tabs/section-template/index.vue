<template>
  <template-skeleton
    v-bind="$attrs">
    <div
      class="section-template"
      v-if="showList">
      <div
        v-if="powerValue">
        <el-tooltip
          :content="tip"
          :disabled="tip === ''"
          placement="top-start">
          <div
            class="section-template__value">
            <i
              class="ri-flashlight-fill section-template__value-icon">
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
        class="section-template__list">
        <slot>
        </slot>
      </div>
    </div>
  </template-skeleton>
</template>

<script setup>
import Vue3Autocounter from 'vue3-autocounter'
import { ElTooltip } from 'element-plus'
import TemplateSkeleton from './skeleton'
import useStore from '~~/store';

const store = useStore()

const props = defineProps({
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
.section-template {
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
}

@media screen and (max-width: #{$mobile-width - 1px}) {
  .section-template {
    &__list {
      grid-template-columns: repeat(auto-fit, minmax(36px, 1fr));
      gap: 16px 12px;
    }
  }
}
</style>