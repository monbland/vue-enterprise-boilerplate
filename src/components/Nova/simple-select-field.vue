<script>
import FieldLayout from '@nova/field-layout.vue'
export default {
  /**
   * Value - id выбранного элемента
   * items - массив айдишников
   * addable - можно ли добавить новый элемент, если true то отображается плюсик справа от селекта
   * Есть слоты:
   * v-slot:item для стилизации всех объектов в селекте
   * v-slot:selection для стилизации выбранного компонента
   * События:
   * @addItem - клик по добавлению
   * @changeItem - клик по изменению, возвращает новое value
   */
  components: {
    FieldLayout,
  },
  props: {
    /**
     *  Текущий выбранный айдишник
     */
    value: {
      type: [String, Number],
      default: () => {
        return null
      },
    },
    /**
     *  Массив айдишников
     */
    items: {
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
    /**
     * Можем ли добавить новый элемент
     */
    addable: {
      type: Boolean,
      default: false,
    },
    /**
     * по какому полю происходит поиск записи
     */
    itemValue: {
      type: String,
      default: 'value',
    },
  },
  methods: {
    /**
     * Добавление
     */
    addItem() {
      this.$emit('add')
    },
    /**
     * Изменение
     * @param item - новое значение value
     */
    changeItem(item) {
      this.$emit('changeItem', item)
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
        <v-col cols="11" class="py-0 px-0">
          <v-select
            class="custom-inspector"
            solo
            flat
            :items="items"
            :value="value"
            :item-value="itemValue"
            append-icon=""
            @change="(e) => changeItem(e)"
          >
            <template v-slot:item="{ item }">
              <slot name="item" :item="item">{{ item }}</slot>
            </template>
            <template v-slot:selection="{ item }">
              <slot name="selection" :item="item">{{ item }}</slot>
            </template>
          </v-select>
        </v-col>
        <v-col cols="1" class="px-0 py-0 text-center">
          <span><v-icon small class="editIcon">mdi-chevron-down</v-icon></span>
        </v-col>
      </div>
      <v-row>
        <v-col cols="12" class="py-0">
          <v-btn
            v-if="addable"
            class="elevation-0"
            x-small
            fab
            dark
            color="#0037EE"
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
    background-color: #00000008;
    outline: 1px solid #70707041;
  }
  &:hover .editIcon {
    display: block;
  }
}
</style>
