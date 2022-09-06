import { reactive } from 'vue'
import configParser from '~~/libs/config-parser'
import { setBodyClass, insertStyle, setColorTheme } from '~~/libs/helper'

const modulesOrder = {
	comment: 1,
	like: 2,
	'like-lite': 3,
	dislike: 4,
	'dislike-lite': 5,
	tip: 6
}

export default (store) => {
	const defaultConfig = {
		'color-theme': 'auto'
	}
	const config = reactive(Object.assign(defaultConfig, configParser()))

	config.modules && config.modules.sort((a, b) => {
		return modulesOrder[a] > modulesOrder[b] ? 1 : -1
	})

	if (config['color-theme'] === 'auto') {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
      store.setData('env', {
        colorTheme: 'dark'
      })
			setColorTheme('dark')
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
			setColorTheme(newColorScheme)
		})
	} else {
    store.setData('env', {
      colorTheme: config['color-theme']
    })
		setColorTheme(config['color-theme'])
	}

	setBodyClass('has-h-padding', config['has-h-padding'])
	setBodyClass('has-v-padding', config['has-v-padding'])

	if (config['dark-theme-color']) {
		insertStyle(`
  body.dark {
    --theme-bg-color: ${config['dark-theme-color']}!important;
  }`)
	}

  if (config.height) {
    insertStyle(`.chat-widget {
      height: ${config.height}px;
    }`)
  }

	return {
		config,
		modulesOrder
	}
}
