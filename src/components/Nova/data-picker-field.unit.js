import Vue from 'vue'
import Vuetify from 'vuetify'
import DataPickerField from './data-picker-field'

Vue.use(Vuetify)

describe('@components/data-picker-field', () => {
  it('exports a valid component', () => {
    expect(DataPickerField).toBeAComponent()
  })
})
