import Vue from 'vue'
import Vuetify from 'vuetify'
import MainLayout from './main.vue'

Vue.use(Vuetify)

describe('@layouts/main.vue', () => {
  it('renders its content', () => {
    const slotContent = '<p>Hello!</p>'
    const { element } = shallowMount(MainLayout, {
      slots: {
        default: slotContent,
      },
    })
    expect(element.innerHTML).toContain(slotContent)
  })
})
