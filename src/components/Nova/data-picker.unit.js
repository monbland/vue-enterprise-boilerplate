import Vue from 'vue'
import Vuetify from 'vuetify'
import DataPicker from './data-picker'

Vue.use(Vuetify)

describe('@components/data-picker', () => {
  it('exports a valid component', () => {
    expect(DataPicker).toBeAComponent()
  })
})
