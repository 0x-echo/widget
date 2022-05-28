<template>
  <template-skeleton
    v-bind="$attrs">
    <div
      class="section-template">
      <div
        v-if="value">
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
              {{ label }}: $
              <span
                v-show="store.widgetConfig.modules[0] === 'like' || store.widgetConfig.modules[0] === 'dislike'">{{ value }}</span>
              <vue3-autocounter
                v-if="(store.widgetConfig.modules.includes('like') && store.widgetConfig.modules[0] !== 'like') || (store.widgetConfig.modules.includes('dislike') && store.widgetConfig.modules[0] !== 'dislike')"
                autoinit
                :duration="1"
                :startAmount='0'
                :endAmount="val"
                separator=","></vue3-autocounter>
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
  label: {
    type: String
  },
  tip: {
    type: String
  },
  value: {
    type: [String, Number]
  }
})

const val = ref(0)
const show = ref(false)

const currentTab = computed(() => store.layout.currentTab)

watch(currentTab, (newVal, oldVal) => {
  if (newVal === 'like' || newVal === 'dislike') {
    val.value = props.value
  }
})
</script>

<style lang="scss">
.section-template {
  padding: 0 30px;
  
  &__value {
    display: inline-flex;
    align-items: center;
    padding: 5px 15px 5px 10px;
    margin-bottom: 30px;
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
    display: flex;
    flex-wrap: wrap;
  }
}
</style>