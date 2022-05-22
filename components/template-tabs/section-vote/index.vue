<template>
  <section-template
    v-bind="$attrs">
    <user-item
      v-for="item in data"
      :key="item.id"
      :avatar="item.author.avatar"
      :address="item.author.address"
      :label="((item.author.address === store.address) ? 'you&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;' : $formatScreenName(item.author.screen_name))"
      :value="item.name">
    </user-item>
  </section-template>
</template>

<script setup>
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