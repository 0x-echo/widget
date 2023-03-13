<template>
  <i
    class="base-menu-item__icon"
    :class="icon">
  </i>
  
  <span
    class="base-menu-item__label">
    {{ label }}
  </span>
  
  <span
    class="base-menu-item__count"
    v-if="count">
    {{ count }}
  </span>
</template>

<script setup>
const props = defineProps({
  count: {
    type: String
  },
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