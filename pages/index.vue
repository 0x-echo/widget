<template>
  <echo
    :color-theme="$route.query['color-theme']"
    :has-v-padding="$route.query['has-v-padding'] === 'true'"
    :has-h-padding="$route.query['has-h-padding'] === 'true'"
    :height="$route.query.height"
    :modules="$route.query.modules.split(',')"
    :no-padding-in-mobile="$route.query['no-padding-in-mobile'] === 'true'"
    :target-uri="$route.query.target_uri">
  </echo>
</template>

<script setup>

</script>

<style lang="scss">

</style>