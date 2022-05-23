<template>
  <div
    class="comment-action"
    role="button">
    <span
      class="comment-action__icon"
      :class="{
        'active': active
      }">
      <i
        :class="icon"
        :title="value">
      </i>
    </span>
    
    <!-- <span
      class="comment-action__count"
      v-if="count">
      {{ count ? $formatNumber(count) : '' }}
    </span> -->

    <span
      class="comment-action__count"
      ref="commentCountRef"
      v-show="count <= 9999">
    </span>
    
    <span
      class="comment-action__count"
      v-if="count > 9999">
      {{ $formatNumber(count) }}
    </span>
  </div>
</template>

<script setup>
import { Flip } from 'number-flip'

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

let flip
const commentCountRef = ref(null)
onMounted(() => {
  flip = new Flip({
    node: commentCountRef.value,
    from: props.count,
    systemArr: [(props.count < 10 && props.count < 10) ? '&nbsp;' : 0, 1, 2, 3, 4, 5, 6, 7, 8, 9 ]
  })
})

watch(() => props.count, (val, oldVal) => {
  if (oldVal <= 9999) {
    try {
      flip.flipTo({
        to: val || ' '
      }) 
    } catch (e) {
      console.log(e)
    }
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
  
  &__icon {
    display: flex;
    align-items: center;
    padding: 8px;
    border-radius: 50%;
    font-size: 14px;
    line-height: 14px;
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      background: var(--bg-color);  
    }
    
    &.active {
      color: var(--color-primary);
    }
  }
  
  &__count {
    margin-left: 8px;
    font-size: 12px;
  }
}
</style>
