<script>
import Moment from 'moment'
export default {
  props: {
    /**
     * Заголовок поля
     */
    title: {
      type: String,
      default: '',
    },
    disabled: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      // Открыто ли меню
      pickerMenu: false,
      // Диапазон дат в формате Date
      range: [],
      // Диапазон дат в формате vuetify data-picker
      rangeDate: [],
    }
  },
  computed: {
    /**
     * Форматтер даты для вывода в текстовое поле
     * @returns {string|*} - отдает либо ничего либо одну дату либо две через дефис
     */
    dateFormatter() {
      if (this.range.length > 1) {
        const from = this.$gettext('с')
        const to = this.$gettext('по')
        return (
          `${from} ` +
          Moment(this.range[0]).format('DD.MM.YYYY') +
          ` ${to} ` +
          Moment(this.range[1]).format('DD.MM.YYYY')
        )
      } else if (this.range.length) {
        return Moment(this.range[0]).format('DD.MM.YYYY')
      } else {
        return ''
      }
    },
  },
  watch: {
    /**
     * Вотчер на диапазон дат чтобы он всегда был последовательным
     */
    range() {
      if (this.range.length > 1) {
        if (this.range[0] > this.range[1]) {
          const buffer = this.range[0]
          this.range[0] = this.range[1]
          this.range[1] = buffer
        }
        // Здесь же эмитится ивент change
        this.$emit('changeItem', this.range)
      }
    },
    /**
     * Вотчер на возвращаемую из пикера дату, форматирование ее в тип даты и отправка в this.range
     */
    rangeDate() {
      if (this.rangeDate.length > 1) {
        this.range = []
        this.rangeDate.map((item) => {
          this.range.push(new Date(item))
        })
      }
    },
  },
}
</script>

<template>
  <v-menu
    ref="picker"
    v-model="pickerMenu"
    :close-on-content-click="false"
    :return-value="range"
    transition="scale-transition"
    offset-y
    min-width="290px"
    :disabled="disabled"
  >
    <template v-slot:activator="{ on }">
      <v-text-field
        :label="title"
        :hint="'Выберите диапазон дат' | translate"
        :placeholder="'с 12.05.2020 по 14.05.2020' | translate"
        persistent-hint
        outlined
        dense
        :value="dateFormatter"
        readonly
        required
        :disabled="disabled"
        v-on="on"
      />
    </template>
    <v-date-picker v-model="rangeDate" range no-title scrollable />
  </v-menu>
</template>

<style lang="scss" module>
@import '@design';
</style>
