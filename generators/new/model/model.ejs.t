---
to: src/models/<%= h.changeCase.pascal(name) %>.js
---
import { BaseModel } from '@models/Hierarchy'

export class <%= h.changeCase.pascal(name) %> extends BaseModel {
  static entity = '<%= h.changeCase.camel(name) %>'

  static url() {
    return ''
  }

  static fields() {
    return {
      ...BaseModel.fields(),
    }
  }
}

export default <%= h.changeCase.pascal(name) %>
