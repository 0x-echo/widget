<template>
  <i
    class="menu-item__icon"
    :class="icon">
  </i>
  
  <span
    class="menu-item__label">
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