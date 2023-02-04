<template>
  <echo
    :config="config">
  </echo>
</template>

<script setup>
import useStore from '~~/store'

const store = useStore()
const route = useRoute()

const config = computed(() => {
  const query = JSON.parse(JSON.stringify(route.query))
  
  for (const f in query) {
    if (f.includes('_')) {
      const prop = f.replace(/_/g, '-')
      query[prop] = query[f]
    }
  }
  
  const booleanProps = [
    'has-h-padding',
    'h-v-padding',
    'show-comment-dislike',
    'support-mumbai',
    'no-padding-in-mobile'
  ]
  
  const stringProps = [
    'dark-theme-bg-color',
    'height',
    'target-site',
    'target-uri'
  ]

  booleanProps.forEach(prop => {
    query[prop] = query[prop] === null || query[prop] === 'true'
  })
  
  stringProps.forEach(prop => {
    query[prop] = query[prop] || ''
  })
  
  query.modules = query.modules ? query.modules.split(',') : ['comment', 'like', 'dislike', 'tip']
  
  // Mirror does not support color-theme:auto
  if (query['target-uri'].includes('mirror.xyz') && (!query['color-theme'] || query['color-theme'] === 'auto')) {
    console.warn('ECHO: Mirror does not support color-theme:auto, set to light instead.')
    query['color-theme'] = 'light'
  } else {
    query['color-theme'] = query['color-theme'] || 'auto'
  }
  
  // set store.env.colorTheme
  if (query['color-theme'] === 'auto') {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      store.setData('env', {
        colorTheme: 'dark'
      })
		} else {
      store.setData('env', {
        colorTheme: 'light'
      })
    }

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			const newColorScheme = event.matches ? 'dark' : 'light'
      store.setData('env', {
        colorTheme: newColorScheme
      })
		})
	} else {
    store.setData('env', {
      colorTheme: query['color-theme']
    })
	}
  
  // if render index page individually, but color-theme is dark, set a dark background
  if (!store.env.inIframe) {
		console.info('env: not in iframe')
		if (query['color-theme'] === 'dark') {
			query['dark-theme-bg-color'] = query['dark-theme-bg-color'] || '#0d0f17'
		}
	}

  return query
})
</script>

<style lang="scss">

</style>