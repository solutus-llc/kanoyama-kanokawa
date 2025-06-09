export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxt/ui',
    '@nuxtjs/tailwindcss'
  ],
  nitro: {
    prerender: {
      routes: ['/']
    }
  },
  app: {
    baseURL: process.env.NODE_ENV === 'production' ? '/kanoyama-kanokawa/' : '/',
    buildAssetsDir: '/assets/',
    head: {
      title: 'ふるさと納税プラットフォーム',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { name: 'description', content: 'ふるさと納税をもっと楽しく、もっと賢く' }
      ],
      link: [
        { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
      ]
    }
  },
  css: ['~/assets/css/main.css'],
  ssr: false,
  target: 'static'
})