import configParser from '../libs/config-parser'

export default () => {
  const defaultConfig = {
    'color-theme': 'auto'
  }
  const config = reactive(Object.assign(defaultConfig, configParser()))
  return {
    config
  }  
}
