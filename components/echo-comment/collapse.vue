<template>
  <div
    class="echo-comment-collapse">
    <img 
      class="echo-comment-collapse__icon"
      alt="more"
      src="@/assets/arrow-go-forward-line.svg">
    
    <template
      v-if="hasAvatar">
      <base-avatar
        class="echo-comment-collapse__avatar"
        v-for="item in data"
        :key="item.id"
        :alt="item.author.screen_name"
        :hash="item.author.address"
        :size="24"
        :src="item.avatar || ''">
      </base-avatar>

      <div
        class="echo-comment-collapse__count"
        v-if="data.length > 1">
        +{{ data.length - 1 }}
      </div>
    </template>

    <div
      class="echo-comment-collapse__more">
      {{ label }}
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  data: {
    type: Array
  },
  hasAvatar: {
    type: Boolean,
    default: false
  },
  label: {
    type: String
  }
})
</script>

<style lang="scss">
.echo-comment-collapse {
  display: flex;
  align-items: center;
  margin-top: 26px;
  cursor: pointer;
  
  &__icon {
    margin-right: 10px;
  }
  
  &__avatar {
    & + & {
      margin-left: 6px;
    }
    
    & + .echo-comment-collapse__more {
      margin-left: 12px;
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
    background: var(--echo-bg-color);
    color: var(--echo-text-color-secondary);
    
    & + .echo-comment-collapse__more {
      margin-left: 12px;
    }
  }
  
  &__more {
    font-size: 12px;
    color: var(--echo-text-color-secondary);
    transition: all .3s ease;
    
    &:hover {
      color: var(--echo-color-primary);
    }
  }
}

@media screen and (max-width: #{$tablet-width - 1px}) {
  .echo-comment-collapse {
    &__avatar {
      display: none;
      
      & + .echo-comment-collapse__more {
        margin-left: 0;
      }
    }
  }
}
</style>