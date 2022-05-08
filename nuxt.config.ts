import { defineNuxtConfig } from 'nuxt'

// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  meta: {
    title: 'Third.chat',
    meta: [{ 
      name: 'viewport', 
      content: 'width=device-width, initial-scale=1, maximum-scale=1.0, minimum-scale=1.0, user-scalable=no' 
    }, {
      hid: 'keywords',
      name: 'keywords',
      content: 'chat, web3',
    }, {
      hid: 'description',
      name: 'description',
      content: 'third.chat',
    }],
    link: [{
      rel: 'preconnect',
      href: 'https://fonts.googleapis.com'
    }, {
      rel: 'preconnect',
      href: 'https://fonts.gstatic.com',
      crossOrigin: ''
    }, {
      rel: 'stylesheet',
      href: 'https://fonts.googleapis.com/css2?family=Work+Sans:wght@300;400;500;600;700&display=swap'
    }]
  },
  css: [
    'remixicon/fonts/remixicon.css',
    'element-plus/dist/index.css',
    '@/styles/_element-plus.scss',
    '@/styles/_base.scss',
    '@/styles/_reset.scss'
  ],
  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/styles/_var.scss";',
        }
      }
    }
  },
  ssr: false
})
