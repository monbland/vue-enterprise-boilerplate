/**
 * Vuex store для переменных лэйаута
 */
export const state = {
  // Открыто ли левое меню
  drawer: false,
  // Открыто ли правое меню
  inspector: false,
}

export const getters = {}

export const mutations = {
  /**
   * Открытие левого меню
   * @param state - хранилище
   * @param value - новое значение
   */
  toggleLeftBar(state, value) {
    state.drawer = value
  },
  /**
   * Отерытие правого меню
   * @param state - хранилище
   * @param value - новое значение
   */
  toggleRightBar(state, value) {
    state.inspector = value
  },
}

export const actions = {}
