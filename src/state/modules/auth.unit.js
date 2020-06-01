import axios from 'axios'
import MockAdapter from 'axios-mock-adapter'
import novaApiClient from '@src/axiosPlugin'

import * as authModule from './auth'

/**
 * Создание мок-токена для проверки правильности обработки реального токена
 * @param {string} type
 * @param {number} expiresTimestamp
 */
function createJWToken(type, expiresTimestamp) {
  const tokenPart1 = JSON.stringify({ typ: 'JWT', alg: 'HS256' })
  const tokenPart2 = JSON.stringify({
    token_type: type,
    exp: expiresTimestamp,
    jti: 'some-jti',
    user_id: 1,
  })
  const tokenPart3 = 'some-token'

  return [tokenPart1, tokenPart2, tokenPart3].map((e) => btoa(e)).join('.')
}

describe('@state/modules/auth', () => {
  it('exports a valid Vuex module', () => {
    expect(authModule).toBeAVuexModule()
  })

  describe('in a store', () => {
    let store
    beforeEach(() => {
      store = createModuleStore(authModule)
      window.localStorage.clear()
    })

    const now = authModule.getNowTimestamp()
    // Пример ответа на правильный логин-пароль
    const goodLoginResponse = {
      access: createJWToken('access', now + 60),
      refresh: createJWToken('refresh', now + 3600),
    }

    // setup mock auth
    const mock = new MockAdapter(novaApiClient)

    // API выдачи токена(входа)
    mock.onPost(/\/obtain-token/).reply((request) => {
      switch (request.data) {
        // Если переданы неверные данные нужно вернуть 401 статус
        case '{"username":"admin","password":"wrong password"}':
          return [
            401,
            {
              detail: 'No active account found with the given credentials',
            },
          ]
        // Если передан пустой запрос нужно отдать такой-же ответ какой отдаст DRF
        case '{}':
          return [
            400,
            {
              username: ['Это поле не может быть пустым.'],
              password: ['Это поле не может быть пустым.'],
            },
          ]
        // Если данные для входа верны, то приходят токен авторизации и обновления токена авторизации
        case '{"username":"admin","password":"password"}':
          return [200, goodLoginResponse]
        default:
          return [500, 'Хуйня какая-то']
      }
    })

    // API проверки токена доступа
    mock.onPost(/\/verify-token/).reply((request) => {
      // Если передан пустой запрос нужно отдать такой-же ответ какой отдаст DRF
      if (request.data === '{}') {
        return [
          400,
          {
            token: ['Это поле не может быть пустым.'],
          },
        ]
      } else {
        const now = authModule.getNowTimestamp()
        const data = JSON.parse(request.data)
        const tokenInfo = authModule.getTokenInfo(data.token)

        // Если передали не тот токен
        if (tokenInfo.token_type !== 'access') {
          return badTokenResponse
        } else {
          if (tokenInfo.exp > now) {
            return [200, {}]
          } else {
            return badTokenResponse
          }
        }
      }
    })

    // API обновления токенов(входа)
    mock.onPost(/\/refresh-token/).reply((request) => {
      const data = JSON.parse(request.data)
      const now = authModule.getNowTimestamp()
      // Если токен забыли передать, возвращаем ошибку как у DRF Simple JWT
      if (!data.refresh) {
        return [
          405,
          {
            refresh: ['Это поле не может быть пустым.'],
          },
        ]
      } else {
        // Проверяем тот ли токен передали
        const tokenInfo = authModule.getTokenInfo(data.refresh)
        // Если передали токен не для обновления
        if (tokenInfo.token_type !== 'refresh') {
          return badTokenResponse
        } else {
          // Если токен свежий, отдаём корректный ответ
          if (tokenInfo.exp > now) {
            return [
              200,
              {
                access: createJWToken('access', now + 60),
                refresh: createJWToken('refresh', 1234567890),
              },
            ]
          } else {
            // Если токен протух, отдаём соответствующий ответ
            return badTokenResponse
          }
        }
      }
    })

    // API информации о текущем пользователе
    mock.onGet(/user\/info/).reply((request) => {
      // Проверяем, указан ли заголовое авторизации, если нет, то отправляем 401
      if (!request.headers.Authorization)
        return [
          401,
          {
            status: 'error',
            message: 'Требуется вход',
          },
        ]
      // Иначе проверяем верный ли токен
      else {
        const now = authModule.getNowTimestamp()
        const tokenInfo = authModule.getTokenInfo(
          request.headers.Authorization.replace(/Bearer /, '')
        )
        // Если токен не протух
        if (tokenInfo.exp > now) {
          return [
            200,
            {
              status: 'success',
              data: validUserExample,
            },
          ]
        } else {
          return badTokenResponse
        }
      }
    })

    it('mutations.SET_ACCESS_TOKEN correctly sets axios default authorization header', () => {
      axios.defaults.headers.common.Authorization = ''

      const someToken = createJWToken('access', 1234567890)

      store.commit('SET_ACCESS_TOKEN', someToken)
      expect(novaApiClient.defaults.headers.common.Authorization).toEqual(
        `Bearer ${someToken}`
      )

      store.commit('SET_ACCESS_TOKEN', null)
      expect(axios.defaults.headers.common.Authorization).toEqual('')
    })

    it('mutations.SET_ACCESS_TOKEN correctly sets expires token time', () => {
      expect(store.state.accessTokenExpires).toEqual(null)

      const someToken = createJWToken('access', 1234567890)

      store.commit('SET_ACCESS_TOKEN', someToken)

      // Проверка, что указано истечение срока действия токена
      expect(store.state.accessTokenExpires).toEqual(1234567890)

      store.commit('SET_ACCESS_TOKEN', null)
      expect(store.state.accessTokenExpires).toEqual(null)
    })

    it('mutations.SET_REFRESH_TOKEN correctly sets expires token time', () => {
      expect(store.state.refreshTokenExpires).toEqual(null)

      const someToken = createJWToken('access', 2234567890)

      store.commit('SET_REFRESH_TOKEN', someToken)

      // Проверка, что указано истечение срока действия токена
      expect(store.state.refreshTokenExpires).toEqual(2234567890)

      store.commit('SET_REFRESH_TOKEN', null)
      expect(store.state.refreshTokenExpires).toEqual(null)
    })

    it('mutations.SET_CURRENT_USER correctly saves currentUser in localStorage', () => {
      let savedCurrentUser = JSON.parse(
        window.localStorage.getItem('auth.currentUser')
      )
      expect(savedCurrentUser).toEqual(null)

      const expectedCurrentUser = { token: 'some-token' }
      store.commit('SET_CURRENT_USER', expectedCurrentUser)

      savedCurrentUser = JSON.parse(
        window.localStorage.getItem('auth.currentUser')
      )
      expect(savedCurrentUser).toEqual(expectedCurrentUser)
    })

    it('getters.loggedIn returns true when accessToken is fresh', () => {
      const now = authModule.getNowTimestamp()
      const someToken = createJWToken('access', now + 30)

      store.commit('SET_ACCESS_TOKEN', someToken)
      expect(store.getters.loggedIn).toEqual(true)
    })

    it('getters.loggedIn returns false when accessToken is not fresh', () => {
      const now = authModule.getNowTimestamp()
      const someToken = createJWToken('access', now - 30)

      store.commit('SET_ACCESS_TOKEN', someToken)
      expect(store.getters.loggedIn).toEqual(false)
    })

    it('getters.loggedIn returns true when accessToken is not fresh but refreshToken is fresh', () => {
      const now = authModule.getNowTimestamp()

      store.commit('SET_ACCESS_TOKEN', createJWToken('access', now - 30))
      store.commit('SET_REFRESH_TOKEN', createJWToken('refresh', now + 3600))
      expect(store.getters.loggedIn).toEqual(true)
    })

    it('getters.loggedIn returns false when accessToken and refreshToken is not fresh', () => {
      const now = authModule.getNowTimestamp()

      store.commit('SET_ACCESS_TOKEN', createJWToken('access', now - 30))
      store.commit('SET_REFRESH_TOKEN', createJWToken('refresh', now - 3600))
      expect(store.getters.loggedIn).toEqual(false)
    })

    it('actions.logIn without credentials throw error 400', () => {
      expect.assertions(1)

      return store.dispatch('logIn').catch((error) => {
        expect(error.response.status).toEqual(400)
      })
    })

    it('actions.logIn with wrong credentials throw error 401', () => {
      expect.assertions(1)

      return store
        .dispatch('logIn', {
          username: 'admin',
          password: 'wrong password',
        })
        .catch((error) => {
          expect(error.response.status).toEqual(401)
        })
    })

    it('actions.logIn commits the currentUser and resolves to the user when NOT already logged in and provided a correct username and password', () => {
      expect.assertions(2)

      return store
        .dispatch('logIn', { username: 'admin', password: 'password' })
        .then((user) => {
          expect(user).toEqual(validUserExample)
          expect(store.state.currentUser).toEqual(validUserExample)
        })
    })

    it('actions.logOut clear all states', () => {
      const now = authModule.getNowTimestamp()

      const accessToken = createJWToken('access', now + 30)
      const refreshToken = createJWToken('refresh', now + 3600)

      store.commit('SET_ACCESS_TOKEN', accessToken)
      store.commit('SET_REFRESH_TOKEN', refreshToken)
      store.commit('SET_CURRENT_USER', validUserExample)

      expect(store.state.accessToken).toEqual(accessToken)
      expect(store.state.refreshToken).toEqual(refreshToken)
      expect(store.state.accessTokenExpires).toEqual(now + 30)
      expect(store.state.refreshTokenExpires).toEqual(now + 3600)
      expect(store.state.currentUser).toEqual(validUserExample)

      expect.assertions(10)

      return store.dispatch('logOut').then(() => {
        expect(store.state.accessToken).toEqual(null)
        expect(store.state.refreshToken).toEqual(null)
        expect(store.state.accessTokenExpires).toEqual(null)
        expect(store.state.refreshTokenExpires).toEqual(null)
        expect(store.state.currentUser).toEqual(null)
      })
    })

    it('actions.refreshToken throw error when refreshToken is not defined', () => {
      expect.assertions(1)

      store.commit('SET_REFRESH_TOKEN', null)
      return store.dispatch('refreshToken').catch((error) => {
        expect(error.message).toEqual('Отсутствует refreshToken')
      })
    })

    it('actions.refreshToken logout and throw error when refreshToken is not fresh', () => {
      const now = authModule.getNowTimestamp()

      const accessToken = createJWToken('access', now - 30)
      const refreshToken = createJWToken('refresh', now - 3600)

      store.commit('SET_ACCESS_TOKEN', accessToken)
      store.commit('SET_REFRESH_TOKEN', refreshToken)
      store.commit('SET_CURRENT_USER', validUserExample)

      expect(store.state.accessToken).toEqual(accessToken)
      expect(store.state.refreshToken).toEqual(refreshToken)
      expect(store.state.accessTokenExpires).toEqual(now - 30)
      expect(store.state.refreshTokenExpires).toEqual(now - 3600)
      expect(store.state.currentUser).toEqual(validUserExample)

      expect.assertions(11)

      return store.dispatch('refreshToken').catch((error) => {
        expect(store.state.accessToken).toEqual(null)
        expect(store.state.refreshToken).toEqual(null)
        expect(store.state.accessTokenExpires).toEqual(null)
        expect(store.state.refreshTokenExpires).toEqual(null)
        expect(store.state.currentUser).toEqual(null)
        expect(error.message).toEqual(
          'Не удалось обновить токен авторизации, так как он "протух"'
        )
      })
    })

    it('actions.refreshToken update access and refresh token when refreshToken is fresh', () => {
      const now = authModule.getNowTimestamp()

      const accessToken = createJWToken('access', now - 30)
      const refreshToken = createJWToken('refresh', now + 60)

      store.commit('SET_ACCESS_TOKEN', accessToken)
      store.commit('SET_REFRESH_TOKEN', refreshToken)

      expect(store.state.accessToken).toEqual(accessToken)
      expect(store.state.refreshToken).toEqual(refreshToken)
      expect(store.state.accessTokenExpires).toEqual(now - 30)
      expect(store.state.refreshTokenExpires).toEqual(now + 60)

      expect.assertions(7)

      return store.dispatch('refreshToken').then((token) => {
        expect(store.state.accessToken).toEqual(token)
        expect(store.state.accessTokenExpires > now).toEqual(true)
        expect(store.state.refreshTokenExpires).toEqual(1234567890)
      })
    })

    it('actions.updateUserInfo resolves to a user when currentUser contains a valid token', () => {
      const now = authModule.getNowTimestamp()
      const accessToken = createJWToken('access', now + 30)
      store.commit('SET_ACCESS_TOKEN', accessToken)

      expect.assertions(2)

      store.commit('SET_CURRENT_USER', null)
      return store.dispatch('updateUserInfo').then((user) => {
        expect(user).toEqual(validUserExample)
        expect(store.state.currentUser).toEqual(validUserExample)
      })
    })

    // it('actions.updateUserInfo update user info, access and refresh token when refreshToken is fresh', () => {
    //   const now = authModule.getNowTimestamp()
    //
    //   const accessToken = createJWToken('access', now - 30)
    //   const refreshToken = createJWToken('refresh', now + 60)
    //
    //   store.commit('SET_ACCESS_TOKEN', accessToken)
    //   store.commit('SET_REFRESH_TOKEN', refreshToken)
    //
    //   expect(store.state.accessToken).toEqual(accessToken)
    //   expect(store.state.refreshToken).toEqual(refreshToken)
    //   expect(store.state.accessTokenExpires).toEqual(now - 30)
    //   expect(store.state.refreshTokenExpires).toEqual(now + 60)
    //
    //   expect.assertions(6)
    //
    //   return store.dispatch('updateUserInfo').then((user) => {
    //     expect(user).toEqual(validUserExample)
    //     expect(store.state.accessTokenExpires > now).toEqual(true)
    //   })
    // })

    it('actions.verifyToken update currentUser when currentUser is null and valid access token', () => {
      const now = authModule.getNowTimestamp()

      const accessToken = createJWToken('access', now + 30)
      store.commit('SET_CURRENT_USER', null)
      store.commit('SET_ACCESS_TOKEN', accessToken)
      expect(store.state.currentUser).toEqual(null)

      expect.assertions(2)

      return store.dispatch('verifyToken').then((isValid) => {
        expect(isValid).toEqual(true)
      })
    })

    it('actions.verifyToken update access token when access token is not fresh but refresh token is fresh', () => {
      const now = authModule.getNowTimestamp()

      const accessToken = createJWToken('access', now - 30)
      const refreshToken = createJWToken('refresh', now + 3600)
      store.commit('SET_ACCESS_TOKEN', accessToken)
      store.commit('SET_REFRESH_TOKEN', refreshToken)

      expect.assertions(2)

      return store.dispatch('verifyToken').then((isValid) => {
        expect(store.state.accessTokenExpires > now).toEqual(true)
        expect(isValid).toEqual(true)
      })
    })

    it('actions.verifyToken resolves to null when access token is invalid', () => {
      const now = authModule.getNowTimestamp()

      const refreshToken = createJWToken('refresh', now + 3600)
      store.commit('SET_ACCESS_TOKEN', refreshToken)

      expect.assertions(2)

      store.commit('SET_CURRENT_USER', { token: 'invalid-token' })
      return store.dispatch('verifyToken').then((isValid) => {
        expect(isValid).toEqual(null)
        expect(store.state.currentUser).toEqual(null)
      })
    })

    // Networking error
    it('actions.logIn throw error without logout when networking error', () => {
      expect.assertions(1)

      mock.reset()
      mock.onPost(/\/obtain-token/).networkErrorOnce()

      return store
        .dispatch('logIn', { username: 'admin', password: 'password' })
        .catch((error) => {
          expect(error.message).toEqual('Network Error')
        })
    })

    it('actions.refreshToken throw error without logout when networking error', () => {
      const now = authModule.getNowTimestamp()

      const refreshToken = createJWToken('refresh', now + 60)

      store.commit('SET_REFRESH_TOKEN', refreshToken)

      expect.assertions(1)

      mock.reset()
      mock.onPost(/\/refresh-token/).networkErrorOnce()

      return store.dispatch('refreshToken').catch((error) => {
        expect(error.message).toEqual(
          'Во время обновления токена авторизации произошла непредвиденная ошибка'
        )
      })
    })

    it('actions.verifyToken throw error when networking error', () => {
      const now = authModule.getNowTimestamp()

      const access = createJWToken('access', now + 60)

      store.commit('SET_ACCESS_TOKEN', access)

      expect.assertions(1)

      mock.reset()
      mock.onPost(/\/verify-token/).networkErrorOnce()

      return store.dispatch('verifyToken').catch((error) => {
        expect(error.message).toEqual('Network Error')
      })
    })
  })
})

const validUserExample = {
  id: 1,
  permissions: {},
  last_login: '2020-04-21T06:37:16.961649+03:00',
  is_superuser: true,
  username: 'admin',
  first_name: '',
  last_name: '',
  is_staff: true,
  is_active: true,
  date_joined: '2020-04-21T02:30:44.677235+03:00',
  name: 'Super Mega Admin',
  email: 'admin@letsnova.ru',
}

const badTokenResponse = [
  401,
  {
    detail: 'Token is invalid or expired',
    code: 'token_not_valid',
  },
]
