<script>
import FieldLayout from '@nova/field-layout.vue'
import _ from 'lodash'

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
     * Можно ли редактировать поле
     */
    editable: {
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
    objects() {
      if (this.value.length) {
        return this.value[0] instanceof Object
      } else {
        return false
      }
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
     * Удаление
     * @param item - айди удаляемого
     */
    deleteItem(item) {
      const index = this.value.findIndex((data) => data === item)
      const newValue = _.cloneDeep(this.value)
      if (index >= 0) {
        newValue.splice(index, 1)
      }
      this.$emit('delete', newValue)
    },
    clickItem(item) {
      this.$emit('clickItem', item)
    },
    selectKey(item) {
      if (this.objects) {
        return item.id
      } else {
        return item
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
      <div v-for="item in value" :key="selectKey(item)" :class="editableClass">
        <v-col cols="11" class="py-0 px-0">
          <span @click="clickItem(item)">
            <slot name="item" :item="item">{{ item }}</slot>
          </span>
          <v-btn icon x-small color="#C14300" @click="deleteItem(item)">
            <v-icon small>mdi-close</v-icon>
          </v-btn>
        </v-col>
        <v-col v-if="editable" cols="1" class="px-0 py-0 text-center editIcon">
          <span><v-icon small class="">mdi-arrow-right</v-icon></span>
        </v-col>
      </div>
      <v-row>
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
