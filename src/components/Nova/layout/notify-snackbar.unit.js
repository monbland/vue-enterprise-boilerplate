import Vue from 'vue'
import Vuetify from 'vuetify'
import NotifySnackbar from './notify-snackbar'

Vue.use(Vuetify)

describe('@components/notify-snackbar', () => {
  it('exports a valid component', () => {
    expect(NotifySnackbar).toBeAComponent()
  })
})
