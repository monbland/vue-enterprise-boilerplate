<script>
import FieldLayout from '@nova/field-layout.vue'
export default {
  /**
   * Value - значение поля для отображения
   * number - является ли поле числовым
   * placeholder - отображаемое значение при пустом инпуте
   * События:
   * @changeItem - изменение поля
   */
  components: {
    FieldLayout,
  },
  props: {
    /**
     *  Значение поля
     */
    value: {
      type: [String, Number],
      default: () => {
        return ''
      },
    },
    /**
     * Заголовок поля
     */
    title: {
      type: String,
      default: '',
    },
    /**
     * Является ли поле числовым
     */
    number: {
      type: Boolean,
      default: false,
    },
    /**
     * Надпись на пустом поле
     */
    placeholder: {
      type: String,
      default: '',
    },
    /**
     * что используем text field или text area
     */
    description: {
      type: Boolean,
      default: false,
    },
    readonly: {
      type: Boolean,
      default: false,
    },
    /**
     * Текст ошибки
     */
    error: {
      type: String,
      default: '',
    },
  },
  data() {
    return {
      // Количество строк для дескрипшена
      rows: 1,
      // Контекст для дескрипшена
      context: this.value ? this.value.toString() : '',
    }
  },
  computed: {
    editableClass() {
      let newClass = 'd-flex align-center'
      if (!this.readonly) {
        newClass += ' editableArea'
      }
      return newClass
    },
  },
  // watch: {
  //   /**
  //    * Вотчер количества строк в текущем контексте
  //    * Если строк больше 4 выключается авторост и ограничивается количество строк
  //    */
  //   rows(newVal) {
  //     if (newVal > 4) {
  //       this.rows = 5
  //     } else {
  //       this.rows = newVal
  //     }
  //   },
  //   /**
  //    * Вотчер контекста
  //    * Проверяет сколько строк и записывает в переменную строк
  //    */
  //   context(newVal, oldVal) {
  //     if (newVal !== oldVal) {
  //       this.rows = this.checkRows(newVal)
  //     }
  //     this.context = newVal
  //   },
  // },
  // mounted() {
  //   // Проверяем сколько строк в полученной строке
  //   this.rows = this.checkRows(this.context)
  // },
  methods: {
    /**
     * Изменение поля
     * @param item - новое значение
     */
    changeItem(item) {
      this.$emit('changeItem', item)
    },
    // /**
    //  * Считает количество строк в стринге
    //  * @param string - входная стринга
    //  * @return {number} - количество строк
    //  */
    // checkRows(string) {
    //   return string.split('\n').length
    // },
  },
}
</script>

<template>
  <FieldLayout>
    <template v-slot:title>
      <span>{{ title }}</span>
    </template>
    <template v-slot:content>
      <div v-if="description" :class="editableClass">
        <v-col class="pl-0 pr-2 py-0">
          <v-textarea
            v-model="context"
            class="custom-inspector"
            rows="5"
            no-resize
            dense
            single-line
            solo
            flat
            :readonly="readonly"
            @change="(e) => changeItem(e)"
          />
        </v-col>
        <span v-if="!!error" class="n-error">{{ error }}</span>
        <v-col v-if="!number" cols="1" class="px-0 py-0 text-center">
          <span><v-icon small class="editIcon">mdi-pencil</v-icon></span>
        </v-col>
      </div>
      <div v-if="!description" :class="editableClass">
        <v-col class="px-0 py-0">
          <v-text-field
            class="custom-inspector"
            dense
            single-line
            solo
            flat
            :readonly="readonly"
            :placeholder="placeholder"
            :value="value"
            :type="number ? 'number' : null"
            @change="(e) => changeItem(e)"
          />
          <span v-if="!!error" class="n-error">{{ error }}</span>
        </v-col>
        <v-col v-if="!number" cols="1" class="px-0 py-0 text-center">
          <span><v-icon small class="editIcon">mdi-pencil</v-icon></span>
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
