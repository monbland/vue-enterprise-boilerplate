import Vue from 'vue'
import Vuetify from 'vuetify'
import SelectField from './select-field'

Vue.use(Vuetify)

describe('@components/select-field', () => {
  it('exports a valid component', () => {
    expect(SelectField).toBeAComponent()
  })
})
