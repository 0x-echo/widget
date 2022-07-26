<template>
  <div>
    <div
      @click="onClick">
      hello world
      <privacy>
        hello world
      </privacy>
    </div>
    
    <dialog-confirm
      icon="ri-error-warning-line"
      message="Are you sure?"
      title="Hello"
      v-model="confirmDialogVisible"
      @submit="uncoverMessage">
    </dialog-confirm>
  </div>
</template>

<script setup>
let confirmDialogVisible = ref(false)

const onClick = (e) => {
  if (e.target.nodeName === 'PRIVACY') {
    confirmDialogVisible.value = true
  }
}

const uncoverMessage = () => {
  console.log('uncover')
}
</script>

<style lang="scss">
privacy {
  color: transparent;
  text-shadow: 0 0 8px var(--text-color-primary);
  cursor: pointer;
}
</style>