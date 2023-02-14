<template>
  <div
    class="base-tab-pane"
    v-if="tabs.includes(value)"
    v-show="active">
    <slot></slot>
  </div>
</template>

<script setup>
import { inject, computed } from 'vue'

const props = defineProps({
  value: {
    type: [String, Number]
  }
})

const active = computed(() => inject('tabProps').modelValue === props.value)
const tabs = computed(() => {
  return inject('tabProps').tabs.map((item) => {
    return item.value
  })
})
</script>

<style lang="scss">
.base-tab-pane {
  height: 100%;
  min-height: 102px;
}
</style>
