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
  margin-top: 60px;
  border-top: 1px solid var(--bg-color);
  font-size: 12px;
  color: var(--text-color-muted);
  
  &__link {
    color: var(--text-color-muted);
  }
}
</style>