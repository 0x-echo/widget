<template>
  <div
    class="reply-list">
    <comment-item
      v-for="item in replies"
      :key="item.id"
      :data="item">
    </comment-item>
    
    <comment-collapse
      v-if="data.length && !showAllReplies"
      :data="data.filter((item, index) => { return index >= maxDisplayReply })"
      @toggle="showAllReplies = !showAllReplies">
    </comment-collapse>
  </div>
</template>

<script setup>
import { computed, ref } from 'vue'
import CommentCollapse from './comment-collapse'
import CommentItem from './comment-item'

const props = defineProps({
  data: {
    type: Array,
    required: true
  }
})

const showAllReplies = ref(false)
const maxDisplayReply = ref(1)

const replies = computed(() => {
  if (showAllReplies.value) {
    return props.data
  } else {
    return props.data.filter((item, index) => { return index < maxDisplayReply.value })
  }
})
</script>

<style lang="scss">
.reply-list {
  margin-top: 30px;
}
</style>