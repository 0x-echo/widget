<template>
  <div
    class="chat-tab-pane"
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
</script>

<style lang="scss">
</style>
