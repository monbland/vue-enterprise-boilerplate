import Vue from 'vue'
import router from '@router'
import store from '@state/store'
import PortalVue from 'portal-vue'
import GetTextPlugin from 'vue-gettext'
import Gravatar from 'vue-gravatar'
import VueTheMask from 'vue-the-mask'
import ConfirmDialog from '@nova/dialogs/confirm-dialog.vue'
import NotifySnackbar from '@nova/layout/notify-snackbar.vue'
import { sync } from 'vuex-router-sync'
import vuetify from './plugins/vuetify'
import App from './app.vue'
import translations from './translations'

// Globally register all `_base`-prefixed components
import '@components/_globals'

import './registerServiceWorker'

// Don't warn about using the dev version of Vue in development.
Vue.config.productionTip = process.env.NODE_ENV === 'production'

// Show commit info in production
if (process.env.NODE_ENV === 'production') {
  if (process.env.CI_BUILD_REF) {
    console.info(`SHA текущего коммита: ${process.env.CI_BUILD_REF}`) // eslint-disable-line no-console
  }
  if (process.env.CI_COMMIT_MESSAGE) {
    console.info(`Сообщение текущего коммита: ${process.env.CI_COMMIT_MESSAGE}`) // eslint-disable-line no-console
  }
}

// If running inside Cypress...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Ensure tests fail when Vue emits an error.
  Vue.config.errorHandler = window.Cypress.cy.onUncaughtException
}

// Подключение валидатора на русском языке
Vue.use(GetTextPlugin, {
  availableLanguages: {
    en: 'English',
    ru: 'Русский',
  },
  defaultLanguage: localStorage.language || 'ru',
  translations: translations,
  silent: process.env.NODE_ENV === 'production',
})
export const getText = Vue.prototype.$gettext

Vue.filter('translate', (value) => {
  return !value ? '' : Vue.prototype.$gettext(value.toString())
})

const app = new Vue({
  router,
  store,
  vuetify,
  render: (h) => h(App),
}).$mount('#app')

Vue.use(PortalVue)

// https://www.npmjs.com/package/vue-gravatar
Vue.component('v-gravatar', Gravatar)

// Наши компоненты диалога подтверждения и оповещений
Vue.component('confirm', ConfirmDialog)
Vue.component('notify', NotifySnackbar)

// https://github.com/vuejs-tips/vue-the-mask
Vue.use(VueTheMask)

sync(store, router)
// If running e2e tests...
if (process.env.VUE_APP_TEST === 'e2e') {
  // Attach the app to the window, which can be useful
  // for manually setting state in Cypress commands
  // such as `cy.logIn()`.
  window.__app__ = app
}
