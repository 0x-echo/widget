<template>
  <div
    class="section-comment">
    <div
      class="section-comment__refresh">
      <i
        class="ri-refresh-line section-comment__refresh-icon">
      </i>
      
      <span>
        2 New Replies
      </span>
    </div>
    
    <comment-list
      v-bind="$attrs">
    </comment-list>
    
    <load-more>
    </load-more>
  </div>
</template>

<script setup>
import CommentList from './comment-list'
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">
.section-comment {
  &__refresh {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 40px;
    margin-bottom: 30px;
    border-radius: 10px;
    font-size: 14px;
    font-weight: 600;
    background: $primary-light;
    color: $primary;
    cursor: pointer;
    
    &:hover {
      
    }
  }
  
  &__refresh-icon {
    display: block;
    margin-right: 8px;
    font-size: 16px;
  }
  
  &__more {
    display: flex;
    align-items: center;
    justify-content: center;
  }
}
</style>