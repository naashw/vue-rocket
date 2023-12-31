// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: {
    enabled: true,

    timeline: {
      enabled: true
    }
  },
  ssr: false,
  css: ["~/assets/css/view360.css"],

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
