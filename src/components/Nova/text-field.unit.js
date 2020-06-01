import Vue from 'vue'
import Vuetify from 'vuetify'
import TextField from './text-field'

Vue.use(Vuetify)

describe('@components/text-field', () => {
  it('exports a valid component', () => {
    expect(TextField).toBeAComponent()
  })
})
