/**
 * Функция для получения данных с сервера
 * @param parent {Boolean} - нужно ли грузить связанные сущности
 * @return {Array}
 */
// import Moment from 'moment'

const DateField = {
  /**
   * Функция создания записи в базе, отправляет данные в бэк и при успехе пишет в vuex-orm
   * @param object - объект для отправки на бэк
   * @return {Promise<any|AxiosResponse<any>>}
   */
  async createRecord(object) {
    try {
      Object.keys(this.fields())
        .filter((key) => object[key] instanceof Date)
        .forEach((key) => {
          object[key] = object[key].toISOString()
        })
      const result = await this.api().post(this.url(), object, { save: false })
      if (result.response.status === 201) {
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
  },

  /**
   * Функция для обновления объекта, отправляет новый объект на бэк и при успехе реактирует в vuex-orm
   * @param object
   * @return {Promise<any|AxiosResponse<any>>}
   */
  async update(object) {
    try {
      const url = this.url() + object.id.toString() + '/'
      Object.keys(this.fields())
        .filter((key) => object[key] instanceof Date)
        .forEach((key) => {
          object[key] = object[key].toISOString()
        })
      const result = await this.api().put(url, object, { save: false })
      if (result.response.status === 200) {
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
  },
}

export default DateField
