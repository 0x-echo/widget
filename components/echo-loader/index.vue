<template>
  <div
    class="echo-loader"
    :style="{
      width: `${size}px`,
      height: `${size}px`
    }">
  </div>
</template>

<script setup>
const props = defineProps({
  size: {
    type: [Number, String],
    default: 15
  }
})
</script>

<style lang="scss">
.echo-loader {
  border-radius: 50%;
  border: 2px solid #fff;
  clip-path: inset(0 0 50% 0);
  transform: rotate(0);
  animation: spin .6s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0);
  }
  to {
    transform: rotate(360deg);
  }
}
</style>