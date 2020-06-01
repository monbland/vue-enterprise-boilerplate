import Vue from 'vue'
import Vuetify from 'vuetify'
import CustomField from './custom-field'

Vue.use(Vuetify)

describe('@components/custom-field', () => {
  it('exports a valid component', () => {
    expect(CustomField).toBeAComponent()
  })
})
