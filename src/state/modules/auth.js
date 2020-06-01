import novaApiClient from '@src/axiosPlugin'
import createAuthRefreshInterceptor from 'axios-auth-refresh'

export const AUTH_ENDPOINT = 'nova/auth'

/**
 * Состояние авторизации
 * @name State
 * @type {object}
 * @property {object} currentUser - Данные о текущем пользователе
 * @property {string} accessToken - Токен авторизации
 * @property {number} accessTokenExpires -  Дата и время истечения токена авторизации в формате Unix Timestamp
 * @property {string} refreshToken - Токен обновления токена авторизации
 * @property {number} refreshTokenExpires -  Дата и время истечения токена обновления авторизации в формате Unix Timestamp
 */
export const state = {
  currentUser: getSavedState('auth.currentUser'),
  accessToken: getSavedState('auth.accessToken'),
  accessTokenExpires: getSavedState('auth.accessTokenExpires'),
  refreshToken: getSavedState('auth.refreshToken'),
  refreshTokenExpires: getSavedState('auth.refreshTokenExpires'),
}

export const mutations = {
  SET_CURRENT_USER(state, newValue) {
    state.currentUser = newValue
    saveState('auth.currentUser', newValue)
  },
  SET_ACCESS_TOKEN(state, newValue) {
    state.accessToken = newValue
    saveState('auth.accessToken', newValue)
    state.accessTokenExpires = getTokenExpires(newValue)
    saveState('auth.accessTokenExpires', state.accessTokenExpires)
    setAuthHeaders(newValue)
  },
  SET_REFRESH_TOKEN(state, newValue) {
    state.refreshToken = newValue
    saveState('auth.refreshToken', newValue)
    state.refreshTokenExpires = getTokenExpires(newValue)
    saveState('auth.refreshTokenExpires', state.refreshTokenExpires)
  },
}

export const getters = {
  // Whether the user is currently logged in.
  loggedIn(state) {
    const now = getNowTimestamp()
    return (
      !!(state.accessToken && state.accessTokenExpires > now) ||
      !!(state.refreshToken && state.refreshTokenExpires > now)
    )
  },
}

export const actions = {
  // This is automatically run in `src/state/store.js` when the app
  // starts, along with any other actions named `init` in other modules.
  init({ state, dispatch }) {
    setAuthHeaders(state.accessToken)

    /**
     * Интерцептор обновления токена, если токен авторизации протух
     * @param failedRequest
     * @returns {Promise<void>}
     */
    async function refreshAuthLogic(failedRequest) {
      if (state.refreshToken) {
        const token = await dispatch('refreshToken')
        setAuthHeaders(token, failedRequest.config.headers)
        return Promise.resolve()
      }
    }

    // Регистрируем интерцептор
    createAuthRefreshInterceptor(novaApiClient, refreshAuthLogic)

    // Проверяем токен
    dispatch('verifyToken')
  },

  // Logs in the current user.
  async logIn({ commit, dispatch, getters }, { username, password } = {}) {
    try {
      // Пытаемся получить токен доступа и токен обновления
      const response = await novaApiClient.post(
        `${AUTH_ENDPOINT}/obtain-token`,
        {
          username,
          password,
        },
        {
          skipAuthRefresh: true,
        }
      )
      const tokens = response.data

      // Обновляем токен доступа, если он указан
      commit('SET_ACCESS_TOKEN', tokens.access || null)
      // Обновляем токен обновления токена доступа, если он указан
      commit('SET_REFRESH_TOKEN', tokens.refresh || null)

      // Получаем информацию о текущем пользователе
      return await dispatch('updateUserInfo')
    } catch (error) {
      await dispatch('logOut')
      throw error
    }
  },

  // Logs out the current user.
  logOut({ commit }) {
    commit('SET_CURRENT_USER', null)
    commit('SET_ACCESS_TOKEN', null)
    commit('SET_REFRESH_TOKEN', null)
    // TODO: Сделать проверку текущего роутинга и выкидывать на логин-скрин, если пользователь находится на странице требующей авторизации
  },

  // Обновление токена доступа
  async refreshToken({ commit, dispatch, state }) {
    if (state.refreshToken) {
      try {
        const response = await novaApiClient.post(
          `${AUTH_ENDPOINT}/refresh-token`,
          {
            refresh: state.refreshToken,
          },
          {
            skipAuthRefresh: true,
          }
        )
        const tokens = response.data
        // Если получили 200, значит токен успешно обновился
        if (response.status === 200) {
          // Обновляем токен доступа, если он указан
          commit('SET_ACCESS_TOKEN', tokens.access || null)
          // Обновляем токен обновления токена доступа, если он указан
          commit('SET_REFRESH_TOKEN', tokens.refresh || null)
          return tokens.access
        }
      } catch (error) {
        // Если получили 401, значит токен протух и нужно заново залогиниться
        if (
          error.isAxiosError &&
          error.response &&
          error.response.status === 401
        ) {
          dispatch('logOut')
          throw new Error(
            'Не удалось обновить токен авторизации, так как он "протух"'
          )
        } else {
          throw new Error(
            'Во время обновления токена авторизации произошла непредвиденная ошибка'
          )
        }
      }
    } else {
      throw new Error('Отсутствует refreshToken')
    }
  },

  // Обновление информации о текущем пользователе
  async updateUserInfo({ commit, state }) {
    if (state.accessToken) {
      // TODO: Отрефакторить под vuex-orm
      const response = await novaApiClient.get('nova/users/user/info')
      const user = response.data.data
      commit('SET_CURRENT_USER', user || {})
      return user
    }
  },

  // Validates the current user's token and refreshes it
  // with new data from the API.
  async verifyToken({ dispatch, state }) {
    // Возвращаем ошибку, если токен авторизации отсутствует
    if (!state.accessToken) return Promise.resolve(null)

    // Проверяем время истечения токена
    const now = getNowTimestamp()
    if (state.accessTokenExpires < now && state.refreshTokenExpires > now) {
      // Обновляем токен
      await dispatch('refreshToken')
    }

    const token = state.accessToken
    try {
      const response = await novaApiClient.post(
        `${AUTH_ENDPOINT}/verify-token`,
        {
          token,
        }
      )
      // Обновляем информацию о пользователе, если её нет
      if (
        (!state.currentUser || Object.keys(state.currentUser).length === 0) &&
        response.status === 200
      ) {
        dispatch('updateUserInfo')
      }
      return response.status === 200
    } catch (error) {
      if (error.response && error.response.status === 401) {
        // Костыль "добрый вечер, приятной отладки". Так как у нас автоматически обновляется токен,
        // но в запросе verifyToken передается не в виде заголовка, а в теле запроса, следовательно запрос
        // нужно повторить
        if (state.accessToken !== token) {
          return dispatch('verifyToken')
        } else {
          dispatch('logOut')
        }
      } else {
        throw error
      }
      return null
    }
  },
}

// ===
// Private helpers
// ===

/**
 * Получить текущее время в формате unix timestamp
 * @returns {number} - Текущий unix timestamp
 */
export function getNowTimestamp() {
  const now = new Date()
  return now.getTime() / 1000
}

/**
 * Получить дату истечения токена авторизации
 * @param token - Simple JWT Token
 * @returns {Number} - Дата истечения токена в unix Timestamp
 */
function getTokenExpires(token) {
  if (token) {
    return getTokenInfo(token).exp
  }
  return null
}

/**
 * Получить информацию о токене
 * @param {string} token - Simple JWT Token
 * @returns {Object}
 */
export function getTokenInfo(token) {
  if (token) {
    return JSON.parse(atob(token.split('.')[1]))
  }
}

/**
 * Получение сохранённого состояния из localStorage по ключу
 * @param {string} key
 * @returns {any}
 */
function getSavedState(key) {
  // Определяем хранилище состояний
  const storage = window.localStorage || window.sessionStorage
  return JSON.parse(storage.getItem(key))
}

/**
 * Сохранение состояния в localStorage по ключу
 * @param {string} key
 * @param {any} state
 */
function saveState(key, state) {
  // Определяем хранилище состояний
  const storage = window.localStorage || window.sessionStorage
  storage.setItem(key, JSON.stringify(state))
}

/**
 * Настраивание axios для передачи заголовка авторизации
 * @param {string} token - Токен авторизации
 * @param {object} headers - Конфигурация axios, где хотим поменять заголовок. Если не указан,
 * то используется novaApiClient
 */
function setAuthHeaders(token, headers = null) {
  if (!headers) {
    headers = novaApiClient.defaults.headers.common
  }
  headers.Authorization = token ? 'Bearer ' + token : ''
}
