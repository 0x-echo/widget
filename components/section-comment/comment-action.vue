<template>
  <div
    class="comment-action"
    :class="{
      'active': active
    }"
    role="button">
    <i
      class="comment-action__icon"
      :class="icon"
      :title="value">
    </i>
    
    <span
      class="comment-action__count"
      v-if="count">
      {{ count || '' }}
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
  },
  value: {
    type: String
  }
})
</script>

<style lang="scss">
.comment-action {
  display: flex;
  align-items: center;
  width: 55px;
  color: var(--text-color-muted);
  
  & + & {
    margin-left: 10px;
  }
  
  &:hover,
  &.active {
    color: var(--color-primary);
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
