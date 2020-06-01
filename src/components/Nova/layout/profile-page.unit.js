import Vue from 'vue'
import Vuetify from 'vuetify'
import ProfilePage from './profile-page'

Vue.use(Vuetify)

describe('@components/profile-page', () => {
  it('exports a valid component', () => {
    expect(ProfilePage).toBeAComponent()
  })
})
