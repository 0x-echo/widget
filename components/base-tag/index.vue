<template>
  <div
    class="base-tag">
    <slot></slot>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
.base-tag {
  display: flex;
  align-items: center;
  height: 20px;
  padding: 0 6px;
  border-radius: 6px;
  font-size: 12px;
  background: var(--echo-color-primary-light);
  color: var(--echo-color-primary);
}
</style>