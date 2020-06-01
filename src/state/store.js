import Vue from 'vue'
import Vuex from 'vuex'
import dispatchActionForAllModules from '@utils/dispatch-action-for-all-modules'
import VuexORM from '@vuex-orm/core'
import database from '@database'
import novaApiClient from '@src/axiosPlugin'
import VuexORMAxios from '@vuex-orm/plugin-axios'

import modules from './modules'

Vue.use(Vuex)
VuexORM.use(VuexORMAxios, { axios: novaApiClient })
const store = new Vuex.Store({
  modules,
  // https://github.com/vuex-orm/
  // https://github.com/vuex-orm/plugin-axios
  plugins: [VuexORM.install(database)],
  // Enable strict mode in development to get a warning
  // when mutating state outside of a mutation.
  // https://vuex.vuejs.org/guide/strict.html
  strict: process.env.NODE_ENV !== 'production',
})

export default store

// Automatically run the `init` action for every module,
// if one exists.
dispatchActionForAllModules('init')
