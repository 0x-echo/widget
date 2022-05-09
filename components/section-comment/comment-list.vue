<template>
  <div
    class="comment-list">
    <comment-item
      :class="{
        'has-replies': item.replies.length
      }"
      v-bind="$attrs"
      v-for="item in data"
      :key="item.id"
      :data="item">
      <reply-list
        :data="item.replies">
      </reply-list>
    </comment-item>
  </div>
</template>

<script setup>
import CommentItem from './comment-item'
import ReplyList from './reply-list'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})
</script>

<script>
export default {
  inheritAttrs: false
}
</script>

<style lang="scss">

</style>