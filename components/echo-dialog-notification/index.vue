<template>
  <base-dialog
    class="echo-dialog-notification"
    title="Notification"
    title-icon="ri-notification-3-line"
    @on-close="$emit('update:modelValue', false)">
    <div
      class="echo-dialog-notification__list">
      <notification-item
        v-for="item in data"
        :key="item.id"
        :data="item">
      </notification-item>
    </div>
  </base-dialog>
</template>

<script setup>
import NotificationItem from './notification-item'

const emits = defineEmits([
  'update:modelValue'
])

const data = [{
  id: '1',
  author: {
    screen_name: 'Code.bit',
    address: 'code',
    avatar: ''
  },
  type: 'made a comment',
  created_at: '2 days ago',
  content: 'hello world'
}, {
  id: '2',
  author: {
    screen_name: 'Joanne.bit',
    address: 'joanne',
    avatar: ''
  },
  type: 'replied to you',
  created_at: '2 days ago',
  content: 'Great!'
}, {
  id: '3',
  author: {
    screen_name: 'Code.bit',
    address: 'hello',
    avatar: ''
  },
  type: 'made a comment',
  created_at: '2 days ago',
  content: 'hello world'
}, {
  id: '4',
  author: {
    screen_name: 'Joanne.bit',
    address: 'great',
    avatar: ''
  },
  type: 'replied to you',
  created_at: '2 days ago',
  content: 'Great!'
}, {
  id: '5',
  author: {
    screen_name: 'Code.bit',
    address: 'hash',
    avatar: ''
  },
  type: 'made a comment',
  created_at: '2 days ago',
  content: 'hello world'
}, {
  id: '6',
  author: {
    screen_name: 'Joanne.bit',
    address: 'world',
    avatar: ''
  },
  type: 'replied to you',
  created_at: '2 days ago',
  content: 'Great!'
}]
</script>

<style lang="scss">
.echo-dialog-notification {
  max-width: 580px;
  
  &__list {
    height: 320px;
    overflow-y: scroll;
  }
}
</style>