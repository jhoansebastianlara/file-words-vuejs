import Vue from 'vue'
import VueI18n from 'vue-i18n'

// langs
import en from './langs/en'

Vue.use(VueI18n)

// Ready translated locale messages
const messages = {en}

// Create VueI18n instance with options
export default new VueI18n({
  locale: 'en',
  fallbackLocale: 'en',
  messages
})
