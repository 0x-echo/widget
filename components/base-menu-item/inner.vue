<template>
  <i
    class="base-menu-item__icon"
    :class="icon">
  </i>
  
  <span
    class="base-menu-item__label">
    {{ label }}
  </span>
</template>

<script setup>
const props = defineProps({
  icon: {
    type: String
  },
  label: {
    type: String
  }
})
</script>

<style lang="scss">

</style>