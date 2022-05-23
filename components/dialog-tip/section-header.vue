<template>
  <div
    class="dialog-tip__section-header">
    <h3
      class="dialog-tip__section-title">
      {{ title }}
    </h3>
    
    <slot></slot>
  </div>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss">

</style>