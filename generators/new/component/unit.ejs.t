---
to: "src/components/<%= h.changeCase.kebab(name).toLowerCase().slice(0, 5) === 'base-' ? '_' : '' %><%= h.changeCase.kebab(name) %>.unit.js"
---
<%
  let fileName = h.changeCase.kebab(name).toLowerCase()
  const importName = h.changeCase.pascal(fileName)
  if (fileName.slice(0, 5) === 'base-') {
    fileName = '_' + fileName
  }
%>
import Vue from 'vue'
import Vuetify from 'vuetify'
import <%= importName %> from './<%= fileName %>'

Vue.use(Vuetify)

describe('@components/<%= fileName %>', () => {
  it('exports a valid component', () => {
    expect(<%= importName %>).toBeAComponent()
  })
})
