import { reactive } from 'vue'
import configParser from '~~/libs/config-parser'
import { setBodyClass, insertStyle, setColorTheme } from '~~/libs/helper'

const modulesOrder = {
	comment: 1,
	like: 2,
	dislike: 3,
	tip: 4
}

export default () => {
	const defaultConfig = {
		'color-theme': 'auto'
	}
	const config = reactive(Object.assign(defaultConfig, configParser()))

	config.modules.sort((a, b) => {
		return modulesOrder[a] > modulesOrder[b] ? 1 : -1
	})

	if (config['color-theme'] === 'auto') {
		if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
			setColorTheme('dark')
		}

		window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (event) => {
			const newColorScheme = event.matches ? 'dark' : 'light'
			setColorTheme(newColorScheme)
		})
	} else {
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

	return {
		config,
		modulesOrder
	}
}
