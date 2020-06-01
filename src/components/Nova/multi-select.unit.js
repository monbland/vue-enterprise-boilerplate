import Vue from 'vue'
import Vuetify from 'vuetify'
import MultiSelect from './multi-select'

Vue.use(Vuetify)

describe('@components/multi-select', () => {
  it('exports a valid component', () => {
    expect(MultiSelect).toBeAComponent()
  })
})
