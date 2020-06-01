---
to: "src/router/views/<%= h.changeCase.kebab(name) %>.unit.js"
---
<%
  const fileName = h.changeCase.kebab(name)
  const importName = h.changeCase.pascal(fileName)
%>
import Vue from 'vue'
import Vuetify from 'vuetify'
import <%= importName %> from './<%= fileName %>'

Vue.use(Vuetify)

describe('@views/<%= fileName %>', () => {
  it('is a valid view', () => {
    expect(<%= importName %>).toBeAViewComponent()
  })
})
