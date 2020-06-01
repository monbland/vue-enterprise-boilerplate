import Vue from 'vue'
import Vuetify from 'vuetify'
import ConfirmDialog from './confirm-dialog'

Vue.use(Vuetify)

describe('@components/confirm-dialog', () => {
  it('exports a valid component', () => {
    expect(ConfirmDialog).toBeAComponent()
  })
})
