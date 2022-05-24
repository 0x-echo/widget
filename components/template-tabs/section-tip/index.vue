<template>
  <section-template
    v-bind="$attrs">
    <user-item
      v-for="item in data"
      :key="item.id"
      :avatar="item.author.avatar"
      :badge="item.times === 1 ? '' : `x${item.times}`"
      :title="((item.author.address === store.address) ? 'you' : $formatScreenName(item.author.screen_name))">
      <!-- <template
        #subtitle> -->
        <!-- <Timeago :datetime="item.created_at" :title="$formatDate(data.created_at)" /> -->
        <!-- x {{ item.times }} -->
      <!-- </template> -->
    </user-item>
  </section-template>
</template>

<script setup>
import { Timeago } from 'vue2-timeago'

import SectionTemplate from '../section-template'
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