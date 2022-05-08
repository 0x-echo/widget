<template>
  <div
    class="comment-collapse">
    <img 
      class="comment-collapse__icon"
      alt="more"
      src="@/assets/arrow-go-forward-line.svg">
    
    <chat-avatar
      class="comment-collapse__avatar"
      v-for="item in data.filter((item, index) => { return index < 3 })"
      :key="item.id"
      :alt="item.name"
      :size="24"
      :src="item.avatar">
    </chat-avatar>
    
    <div
      class="comment-collapse__count"
      v-if="data.length > 3">
      +{{ data.length - 3 }}
    </div>
    
    <div
      class="comment-collapse__more"
      @click="$emit('toggle')">
      View {{ data.length }} more replies
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array,
    required: true
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
  
  &__cound {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 24px;
    height: 24px;
    margin-left: 6px;
    border-radius: 50%;
    font-size: 12px;
    font-weight: 500;
    background: $bg-color;
    color: $text-secondary;
  }
  
  &__more {
    margin-left: 12px;
    font-size: 12px;
    color: $text-secondary;
    cursor: pointer;
    transition: all .3s ease;
    
    &:hover {
      color: $primary;
    }
  }
}
</style>