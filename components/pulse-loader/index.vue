<template>
  <div
    class="pulse-loader">
    <div
      class="pulse-loader__dot"
      v-for="item in 3"
      :key="item"
      :style="{
        'animation-delay': `${0.12 * item}s`
      }">
    </div>
  </div>
</template>

<script>
export default {
  data () {
    return {
      
    }
  }
}
</script>

<style lang="scss">
.pulse-loader {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 30px 0;
  
  &__dot {
    display: inline-block;
    margin: 2px;
    height: 8px;
    width: 8px;
    border-radius: 50%;
    background-color: var(--color-primary);
    animation-name: pulse;
    animation-fill-mode: both;
    animation-timing-function: cubic-bezier(0.2, 0.68, 0.18, 1.08);
    animation-iteration-count: infinite;
    animation-duration: 0.75s;
  }
}

@keyframes pulse {
  0%,
  80% {
    transform: scale(1);      
    opacity: 1;
  }
  45% {
    transform: scale(0.1);       
    opacity: 0.7;
  }
}
</style>