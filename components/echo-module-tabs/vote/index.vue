<template>
  <echo-module-tabs-template
    v-bind="$attrs"
    :show-list="data.length > 0">
    <base-user-item
      v-for="item in data"
      :key="item.id"
      :avatar="item.author.avatar || ''"
      :address="item.author.address"
      :title="((item.author.address === store.address) ? 'you' : $formatScreenName(item.author.screen_name))">
    </base-user-item>
  </echo-module-tabs-template>
</template>

<script setup>
import useStore from '~~/store'

const store = useStore()
const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss">
</style>