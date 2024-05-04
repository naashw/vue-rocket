// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  postcss: {
    plugins: {
      tailwindcss: {},
      autoprefixer: {},
    },
  },
  ssr: false,
  css: ["~/assets/css/view360.css", "~/assets/css/main.css"],

  runtimeConfig: {
    public: {
      pusher: {
        appId: 'app-id',
        key: 'app-key',
        secret: 'app-secret',
        host: 'localhost',
        port: 6001,
        cluster: 'visiteici',
        useTLS: false,
      },
      apiUrl: 'http://localhost:3001',
    },
  },
});
