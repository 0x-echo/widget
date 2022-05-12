<template>
  <div
    class="chat-tag">
    <slot></slot>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
.chat-tag {
  display: flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 12px;
  background: $primary-light;
  color: $primary;
}
</style>