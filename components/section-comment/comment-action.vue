<template>
  <div
    class="comment-action"
    :class="{
      'active': active
    }"
    role="button"
    title="">
    <i
      class="comment-action__icon"
      :class="icon">
    </i>
    
    <span
      class="comment-action__count"
      v-if="count">
      {{ count }}
    </span>
  </div>
</template>

<script setup>
const props = defineProps({
  active: {
    type: Boolean,
    default: false
  },
  count: {
    type: [Number, String]
  },
  icon: {
    type: String,
    required: true
  }
})
</script>

<style lang="scss">
.comment-action {
  display: flex;
  align-items: center;
  width: 55px;
  color: $text-muted;
  
  & + & {
    margin-left: 10px;
  }
  
  &:hover,
  &.active {
    color: $primary;
  }
  
  &__icon {
    font-size: 14px;
    cursor: pointer;
  }
  
  &__count {
    margin-left: 8px;
    font-size: 12px;
  }
}
</style>
