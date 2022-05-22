<template>
  <footer
    class="chat-footer">
    <div>
      Powered by Third.Chat <span class="chat-footer__beta-tag">beta</span>
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
const setDarkMode = function () {
  document.body.classList.add('dark')
}
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
  
  &__beta-tag {
    padding: 2px 4px;
    margin-left: 2px;
    border-radius: 4px;
    font-size: 8px;
    font-weight: 600;
    text-transform: uppercase;
    background: var(--color-primary);
    color: white;
    line-height: 1;
    display: inline-block;
    transform: scale(0.8);
  }
  
  &__link {
    color: var(--text-color-muted);
  }
}
</style>