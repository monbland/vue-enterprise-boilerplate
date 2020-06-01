import Vue from 'vue'
import Vuetify from 'vuetify'
import FieldLayout from './field-layout'

Vue.use(Vuetify)

describe('@components/field-layout', () => {
  it('exports a valid component', () => {
    expect(FieldLayout).toBeAComponent()
  })
})
