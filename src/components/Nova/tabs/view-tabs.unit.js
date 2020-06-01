import Vue from 'vue'
import Vuetify from 'vuetify'
import ViewTabs from './view-tabs'

Vue.use(Vuetify)

describe('@nova/tabs/view-tabs', () => {
  it('exports a valid component', () => {
    expect(ViewTabs).toBeAComponent()
  })
})
