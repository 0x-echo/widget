<template>
  <echo-module-tabs-template
    v-bind="$attrs"
    :show-list="data.length > 0">
    <user-item
      v-for="item in data"
      :key="item.id"
      :avatar="item.author.avatar || ''"
      :badge="item.times === 1 ? '' : `x${item.times}`"
      :address="item.author.address"
      :title="((item.author.address === store.address) ? 'you' : $formatScreenName(item.author.screen_name))">
      <!-- <template
        #subtitle> -->
        <!-- <Timeago :datetime="item.created_at" :title="$formatDate(data.created_at)" /> -->
        <!-- x {{ item.times }} -->
      <!-- </template> -->
    </user-item>
  </echo-module-tabs-template>
</template>

<script setup>
import { Timeago } from 'vue2-timeago'
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