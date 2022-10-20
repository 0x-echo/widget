<template>
  <div
    class="echo-comment-reply-list">
    <transition-group
      name="list">
      <echo-comment-item
        v-bind="$attrs"
        v-for="item in replies"
        :key="item.id"
        avatar-size="small"
        :data="item">
      </echo-comment-item>
    </transition-group>

    <!-- when total page === 1  and has not loaded replies -->
    <echo-comment-collapse
      v-if="total - maxDisplayReply > 0 && Math.ceil(parentPost.reply_counts / 10) === 1 && parentPost.current_reply_page === 0"
      :data="collapsedList"
      has-avatar
      :label="`View ${total - maxDisplayReply} more ${ total - maxDisplayReply === 1 ? 'reply' : 'replies'}`"
      @click="toggle">
    </echo-comment-collapse>
    
    <!-- <echo-comment-collapse
      :label="`View ${collapsedList.length} replies`">
    </echo-comment-collapse> -->
    
    <!-- when current page >= 1 and has more replies-->
    <echo-comment-collapse
      v-if="total - maxDisplayReply > 0 && Math.ceil(parentPost.reply_counts / 10) > 1 && parentPost.current_reply_page < Math.ceil(parentPost.reply_counts / 10)"
      label="Show more replies"
      @click="toggle">
    </echo-comment-collapse>
  </div>
</template>

<script setup>
const props = defineProps({
  total: {
    type: Number,
    default: 0
  },
  parentPost: {
    type: Object
  },
  data: {
    type: Array,
    required: true
  }
})

const showAllReplies = ref(props.total > 1)
const maxDisplayReply = ref(2)

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
  emits('load-children', props.data[0].direct_parent_id, props.parentPost)
}
</script>

<style lang="scss">
.echo-comment-reply-list {
  margin-top: 20px;
}
</style>