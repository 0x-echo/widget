<template>
  <div
    class="comment-collapse">
    <img 
      class="comment-collapse__icon"
      alt="more"
      src="@/assets/arrow-go-forward-line.svg">
    
    <chat-avatar
      class="comment-collapse__avatar"
      v-for="item in data"
      :key="item.id"
      :alt="item.author.screen_name"
      :size="24"
      :src="item.avatar">
    </chat-avatar>

    <div
      class="comment-collapse__count"
      v-if="data.length > 1">
      +{{ data.length - 1 }}
    </div>

    <div
      class="comment-collapse__more"
      @click="$emit('toggle')">
      View {{ total - 1 }} more {{ total - 1 === 1 ? 'reply' : 'replies' }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true
  },
  total: {
    type: Number,
    default: 0
  }
})
</script>

<style lang="scss">
.comment-collapse {
  display: flex;
  align-items: center;
  margin-top: 26px;
  
  &__icon {
    margin-right: 10px;
  }
  
  &__avatar {
    & + & {
      margin-left: 6px;
    }
  }
  
  &__count {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 6px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 500;
    background: var(--bg-color);
    color: var(--text-color-secondary);
  }
  
  &__more {
    margin-left: 12px;
    font-size: 12px;
    color: var(--text-color-secondary);
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      color: var(--color-primary);
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .comment-collapse {
    &__avatar {
      display: none;
      
      & + .comment-collapse__more {
        margin-left: 0;
      }
    }
  }
}
</style>