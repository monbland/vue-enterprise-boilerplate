import Vue from 'vue'
import Vuetify from 'vuetify'
import SimpleSelectField from './simple-select-field'

Vue.use(Vuetify)

describe('@components/simple-select-field', () => {
  it('exports a valid component', () => {
    expect(SimpleSelectField).toBeAComponent()
  })
})
