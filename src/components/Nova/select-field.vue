<script>
import FieldLayout from '@nova/field-layout.vue'

export default {
  /**
   * Value - массив айдишников для отображения
   * Есть слот v-slot:item для стилизации отдельного компонента
   * События:
   * @add - клик по добавлению
   * @delete - клик по удалению, так же возвращает новый массив элементов
   */
  components: {
    FieldLayout,
  },
  props: {
    /**
     *  Массив объектов
     */
    value: {
      type: [Number, String],
      default: () => {
        return null
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
     * Можно ли редактировать поле
     */
    editable: {
      type: Boolean,
      default: false,
    },
    /**
     * Можно ли добавлять
     */
    addable: {
      type: Boolean,
      default: false,
    },
  },
  computed: {
    editableClass() {
      let newClass = 'd-flex align-center'
      if (this.editable) {
        newClass += ' editableArea'
      }
      return newClass
    },
  },
  methods: {
    /**
     * Добавление
     */
    addItem() {
      this.$emit('add')
    },
    clickItem(item) {
      this.$emit('clickItem', item)
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
      <div :class="editableClass">
        <v-col cols="11" class="py-0 px-0">
          <span @click="clickItem(value)">
            <slot name="item" :item="value">{{ value }}</slot>
          </span>
        </v-col>
        <v-col v-if="editable" cols="1" class="px-0 py-0 text-center editIcon">
          <span><v-icon small class="">mdi-arrow-right</v-icon></span>
        </v-col>
      </div>
      <v-row v-if="addable">
        <v-col class="py-0">
          <v-btn
            x-small
            fab
            dark
            color="#0037EE"
            class="elevation-0"
            style="width: 17px; height: 17px"
            @click="addItem"
          >
            <v-icon small>mdi-plus</v-icon>
          </v-btn>
        </v-col>
      </v-row>
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
    color: #0037ee;
    cursor: pointer;
    outline: 1px solid #70707041;
  }
  &:hover .editIcon {
    display: block;
    background-color: #00000008;
  }
}
</style>
