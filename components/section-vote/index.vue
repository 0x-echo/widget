<template>
  <section-template
    label="Total voting value"
    :value="value">
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
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  value: {
    type: String,
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
    color: $text-secondary;
    
    strong {
      font-weight: 600;
    }
  }
  
  &__list {
    display: flex;
    flex-wrap: wrap;
  }
}
</style>