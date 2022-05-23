<template>
  <section-template
    v-bind="$attrs">
    <user-item
      v-for="item in data"
      :key="item.id"
      :avatar="item.avatar"
      :label="item.created_at"
      :value="item.name">
    </user-item>
  </section-template>
</template>

<script setup>
import SectionTemplate from '../section-template'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>

<style lang="scss">
</style>