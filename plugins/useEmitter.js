import { defineNuxtPlugin } from '#app'
import mitt from 'mitt'
const emitter = mitt()

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('bus', {
    emit: emitter.emit,
    off: emitter.off,
    on: emitter.on
  })
})