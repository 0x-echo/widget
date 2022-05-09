<template>
  <footer
    class="chat-footer">
    <div>
      Powered by third.chat
    </div>
    
    <div>
      <a 
        class="chat-footer__link"
        href=""
        target="_blank">
        Privacy Policy
      </a>
    </div>
  </footer>
</template>

<script setup>
</script>

<style lang="scss">
.chat-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 15px 0;
  margin-top: 30px;
  border-top: 1px solid $bg-color;
  font-size: 12px;
  color: $text-muted;
  
  &__link {
    color: $text-muted;
  }
}
</style>