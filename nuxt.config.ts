import { defineNuxtConfig } from 'nuxt'

const baseURL = 'http://95.216.99.122:9000'
// const baseURL = 'http://127.0.0.1:9000'

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
  runtimeConfig: {
    public:  {
      common: {
        PROTOCOL_VERSION: '0.0.1'
      },
      api: {
        GET_POST: baseURL + '/api/v1/posts',
        CREATE_POST: baseURL + '/api/v1/posts'
      },
      types: {
        COMMENT: 'comment'
      }
    }
  },
  css: [
    'remixicon/fonts/remixicon.css',
    'element-plus/dist/index.css',
    '@/styles/_element-plus.scss',
    '@/styles/_base.scss',
    '@/styles/_reset.scss',
    '@/styles/_transition.scss',
    '@/styles/themes/_default.scss',
    '@/styles/themes/_dark.scss'
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
