import * as layoutModule from './layout'

describe('@state/modules/layout', () => {
  it('exports a valid Vuex module', () => {
    expect(layoutModule).toBeAVuexModule()
  })
})
