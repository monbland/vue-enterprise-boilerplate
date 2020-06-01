---
to: "src/router/layouts/<%= h.changeCase.kebab(name) %>.unit.js"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName) + 'Layout'
%>
import Vue from 'vue'
import Vuetify from 'vuetify'
import <%= importName %> from './<%= fileName %>'

Vue.use(Vuetify)

describe('@layouts/<%= fileName %>', () => {
  it('renders its content', () => {
    const slotContent = '<p>Hello!</p>'
    const { element } = shallowMount(<%= importName %>, {
      slots: {
        default: slotContent,
      },
    })
    expect(element.innerHTML).toContain(slotContent)
  })
})
