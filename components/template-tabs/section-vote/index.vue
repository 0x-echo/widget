<template>
  <section-template
    v-bind="$attrs">
    <user-item
      v-for="item in data"
      :key="item.id"
      :avatar="item.avatar"
      :label="`$${item.asset}`"
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
.section-vote {
  padding: 0 30px;
  
  &__value {
    margin-bottom: 30px;
    font-size: 14px;
    color: var(--text-color-secondary);
    
    strong {
      font-weight: 500;
    }
  }
  
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>