<script>
import FieldLayout from '@nova/field-layout.vue'
import Moment from 'moment'
export default {
  components: {
    FieldLayout,
  },
  props: {
    /**
     *  Значение поля - массив из дат начала и конца
     */
    value: {
      type: Array,
      default: () => {
        return []
      },
    },
    /**
     * Заголовок поля
     */
    title: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // Открыто ли меню
      pickerMenu: false,
      // Диапазон дат в формате Date
      range: this.value,
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
        const fromDate = this.range[0]
          ? Moment(this.range[0]).format('DD.MM.YYYY')
          : ''
        const toDate = this.range[1]
          ? Moment(this.range[1]).format('DD.MM.YYYY')
          : ''
        return `${from} ${fromDate} ${to} ${toDate}`
      } else if (this.range.length) {
        return this.range[0] ? Moment(this.range[0]).format('DD.MM.YYYY') : ''
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
  <FieldLayout>
    <template v-slot:title>
      <span>{{ title }}</span>
    </template>
    <template v-slot:content>
      <div class="d-flex editableArea align-center">
        <v-col class="px-0 py-0">
          <v-menu
            ref="picker"
            v-model="pickerMenu"
            :close-on-content-click="false"
            :return-value="range"
            transition="scale-transition"
            offset-y
            min-width="290px"
          >
            <template v-slot:activator="{ on }">
              <v-text-field
                class="custom-inspector"
                dense
                single-line
                solo
                flat
                :value="dateFormatter"
                readonly
                required
                v-on="on"
              />
            </template>
            <v-date-picker v-model="rangeDate" range no-title scrollable />
          </v-menu>
        </v-col>
        <v-col cols="1" class="px-0 py-0 text-center">
          <span><v-icon small class="editIcon">mdi-calendar</v-icon></span>
        </v-col>
      </div>
    </template>
  </FieldLayout>
</template>

<style lang="scss" scoped>
@import '@design';
.editIcon {
  display: none;
}
.editableArea {
  &:hover {
    background-color: #00000008;
    outline: 1px solid #70707041;
  }
  &:hover .editIcon {
    display: block;
  }
}
</style>
