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
      v-if="showAllReplies && total > 1"
      :data="collapsedList"
      :total="total"
      @toggle="toggle">
    </comment-collapse>
  </div>
</template>

<script setup>
import CommentCollapse from './comment-collapse'
import CommentItem from './comment-item'

const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  data: {
    type: Array,
    required: true
  }
})

const showAllReplies = ref(props.total > 1)
const maxDisplayReply = ref(1)

const emits = defineEmits([
  'load-children',
])

const replies = computed(() => {
  return props.data
  if (showAllReplies.value) {
    return props.data
  } else {
    return props.data.filter((item, index) => { return index < maxDisplayReply.value })
  }
})

const collapsedList = computed(() => {
  return props.data.filter((item, index) => { return index >= maxDisplayReply.value })
})

const toggle = () => {
  showAllReplies.value = !showAllReplies.value
  emits('load-children', props.data[0].direct_parent_id)
}
</script>

<style lang="scss">
.reply-list {
  margin-top: 30px;
}
</style>