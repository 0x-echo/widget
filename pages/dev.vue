<template>
  <div>
   Just for iframe test
   <iframe 
   width="100%"
   height="800"
   src="http://localhost:3001/?target_uri=hello2&modules=comment,like&rpc_url=http://localhost:9000">
   </iframe>
  </div>
</template>

<script setup>

</script>

<style lang="scss">
privacy {
  color: transparent;
  text-shadow: 0 0 8px var(--text-color-primary);
  cursor: pointer;
}
</style>