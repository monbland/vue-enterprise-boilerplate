import Vue from 'vue'
import Vuetify from 'vuetify'
import EmptyLayout from './empty'

Vue.use(Vuetify)

describe('@layouts/empty', () => {
  it('renders its content', () => {
    const slotContent = '<p>Hello!</p>'
    const { element } = shallowMount(EmptyLayout, {
      slots: {
        default: slotContent,
      },
    })
    expect(element.innerHTML).toContain(slotContent)
  })
})
