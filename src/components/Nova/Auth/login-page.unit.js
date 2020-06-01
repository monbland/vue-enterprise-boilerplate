import Vue from 'vue'
import Vuetify from 'vuetify'
import LoginPage from './login-page'

Vue.use(Vuetify)

describe('@components/login-page', () => {
  it('exports a valid component', () => {
    expect(LoginPage).toBeAComponent()
  })
})
