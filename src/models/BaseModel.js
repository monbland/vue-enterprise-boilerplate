/**
 * File
 * Здесь расположена базовая модель хранилища vuex-orm
 * Для модели расписаны основные методы получения, отправки, изменения и удаления данных на бэк
 */
import { HasMany, HasOne, Model, BelongsToMany } from '@vuex-orm/core'

export class BaseModel extends Model {
  static entity = 'baseModel'

  /**
   * Ниже описаны типы модулей
   */
  static types() {
    return {
      BASE_MODEL: BaseModel,
    }
  }

  /**
   * Ниже определен базовый primary key для всех моделей
   * @type {string}
   */
  static primaryKey = 'id'

  /**
   * Базовое поле id есть во всех моделях
   * @return {Fields}
   */
  static fields() {
    return {
      id: this.number(null),
    }
  }

  /**
   * Функция для получения данных с сервера
   * @param parent {Boolean} - нужно ли грузить связанные сущности
   * @return {Array}
   */
  static async fetch(parent) {
    if (parent) {
      Object.values(this.fields())
        .filter(
          (field) =>
            field instanceof HasMany ||
            field instanceof HasOne ||
            field instanceof BelongsToMany
        )
        .forEach((field) => field.related.fetch(false))
    }
    try {
      const result = await this.api().get(this.url(), { save: false })
      if (result.response.data.length) {
        Object.entries(this.fields())
          .filter((entry) => entry[1] instanceof BelongsToMany)
          .forEach((entry) => {
            result.response.data.map((item) => {
              item[entry[0]] = item[entry[0]].map((subItem) => {
                return {
                  id: subItem,
                  pivot: {
                    id: subItem,
                  },
                }
              })
            })
          })
        await result.save()
        return result.response
      }
    } catch (e) {
      return e.response
    }
  }

  /**
   * Функция для получения данных одного объекта с сервера
   * @param parent {Boolean} - нужно ли грузить связанные сущности
   * @return {Array}
   */
  static async fetchOne(parent, id) {
    if (parent) {
      Object.values(this.fields())
        .filter((field) => field instanceof HasMany || field instanceof HasOne)
        .forEach((field) => field.related.fetch(false))
    }
    try {
      const url = this.url() + id + '/'
      const result = await this.api().get(url, { save: true })
      if (result.response.data.length) {
        return result.response
      }
    } catch (e) {
      return e.response
    }
  }

  /**
   * Функция создания записи в базе, отправляет данные в бэк и при успехе пишет в vuex-orm
   * @param object - объект для отправки на бэк
   * @return {Promise<any|AxiosResponse<any>>}
   */
  static async createRecord(object) {
    try {
      const result = await this.api().post(this.url(), object, { save: false })
      if (result.response.status === 201) {
        Object.entries(this.fields())
          .filter((entry) => entry[1] instanceof BelongsToMany)
          .forEach((entry) => {
            result.response.data[entry[0]] = result.response.data[entry[0]].map(
              (subItem) => {
                return {
                  id: subItem,
                  pivot: {
                    id: subItem,
                  },
                }
              }
            )
          })
        await result.save()
        return result.response
      }
    } catch (e) {
      if (e.response.status === 400) {
        e.response.error = true
        return e.response
      } else if (e.response.status === 403) {
        e.response.error = true
        e.response.logout = true
        return e.response
      }
    }
  }

  /**
   * Функция для обновления объекта, отправляет новый объект на бэк и при успехе реактирует в vuex-orm
   * @param object
   * @return {Promise<any|AxiosResponse<any>>}
   */
  static async update(object) {
    try {
      const url = this.url() + object.id.toString() + '/'
      Object.entries(object)
        .filter((entry) => entry[1] instanceof Array)
        .forEach((entry) => {
          if (entry[1].length && entry[1][0] instanceof Object) {
            object[entry[0]] = entry[1].map((item) => item.id)
          }
        })
      const result = await this.api().put(url, object, { save: false })
      if (result.response.status === 200) {
        Object.entries(this.fields())
          .filter((entry) => entry[1] instanceof BelongsToMany)
          .forEach((entry) => {
            result.response.data[entry[0]] = result.response.data[entry[0]].map(
              (subItem) => {
                return {
                  id: subItem,
                  pivot: {
                    id: subItem,
                  },
                }
              }
            )
          })
        await result.save()
        return result.response
      }
    } catch (e) {
      console.error(e)
      if (e.response.status === 400) {
        e.response.error = true
        return e.response
      } else if (e.response.status === 403) {
        e.response.error = true
        e.response.logout = true
        return e.response
      }
    }
  }

  /**
   * Функция удаления объекта - отправляет запрос на удаление и удаляет из vuex-orm
   * @param object
   * @return {Promise<any|AxiosResponse<any>>}
   */
  static async remove(object) {
    try {
      const url = this.url() + object.id.toString() + '/'
      const result = await this.api().delete(url, {
        delete: object.id,
      })
      if (result.response.status === 204) {
        return result.response
      }
    } catch (e) {
      if (e.response.status === 400) {
        return e.response
      } else if (e.response.status === 403) {
        e.response.error = true
        e.response.logout = true
        return e.response
      }
    }
  }
}

export default BaseModel
