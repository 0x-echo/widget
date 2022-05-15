<template>
  <div
    class="reply-list">
    <transition-group
      name="list">
      <comment-item
        v-bind="$attrs"
        v-for="item in replies"
        :key="item.id"
        :data="item">
      </comment-item>
    </transition-group>
    
    <comment-collapse
      v-if="collapsedList.length && !showAllReplies"
      :data="collapsedList"
      @toggle="showAllReplies = !showAllReplies">
    </comment-collapse>
  </div>
</template>

<script setup>
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

const collapsedList = computed(() => {
  return props.data.filter((item, index) => { return index >= maxDisplayReply.value })
})
</script>

<style lang="scss">
.reply-list {
  margin-top: 30px;
}
</style>