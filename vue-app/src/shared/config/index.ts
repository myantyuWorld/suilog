export const config = {
  app: {
    name: 'Vue3 FSD App',
    version: '1.0.0',
    description: 'Vue3 application with FSD architecture'
  },
  storage: {
    prefix: 'vue-app-',
    defaultExpiration: 24 * 60 * 60 * 1000 // 24 hours
  },
  ui: {
    debounceDelay: 300,
    animationDuration: 300
  }
}