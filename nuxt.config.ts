// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-02-20", // Updated to current date
  devtools: { enabled: true },
  css: ["~/styles/main.scss"],
  components: true,

  vite: {
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: `@use "@/styles/_variables.scss" as *; @use "@/styles/_responsive.scss" as *;`,
        },
      },
    },
  },

  app: {
    head: {
      link: [
        // Preconnect to the Google Fonts domains
        { rel: "preconnect", href: "https://fonts.googleapis.com" },
        {
          rel: "preconnect",
          href: "https://fonts.gstatic.com",
          crossorigin: "",
        },
        // Link to Google Fonts styles
        {
          rel: "stylesheet",
          href: "https://fonts.googleapis.com/css2?family=Orbitron:wght@400..900&family=Roboto:ital,wght@0,100;0,300;0,400;0,500;0,700;0,900;1,100;1,300;1,400;1,500;1,700;1,900&display=swap",
        },
      ],
    },
  },

  runtimeConfig: {
    supabaseUrl: process.env.SUPABASE_URL,
    supabaseKey: process.env.SUPABASE_KEY,
  },

  modules: ["@nuxtjs/i18n"],

  i18n: {
    langDir: "locales",
    locales: [
      { code: "en", file: "en.json" },
      // Add other languages as needed
    ],
    defaultLocale: "en",
  },
});
