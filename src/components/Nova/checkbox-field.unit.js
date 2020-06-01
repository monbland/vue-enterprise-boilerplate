import Vue from 'vue'
import Vuetify from 'vuetify'
import CheckboxField from './checkbox-field'

Vue.use(Vuetify)

describe('@components/checkbox-field', () => {
  it('exports a valid component', () => {
    expect(CheckboxField).toBeAComponent()
  })
})
