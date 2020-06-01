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
      type: Boolean,
      default: false,
    },
    /**
     * Заголовок поля
     */
    title: {
      type: String,
      default: '',
    },
  },
  methods: {
    /**
     * Изменение поля
     * @param item - новое значение
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
      <label class="checkboxContainer">
        <input
          type="checkbox"
          :value="value"
          :checked="value"
          @change="(e) => changeItem(e.target.checked)"
        />
        <span class="checkboxMark" />
      </label>
      <!--      <v-checkbox-->
      <!--        class="custom-inspector py-0 my-0"-->
      <!--        dense-->
      <!--        color="#0037EE"-->
      <!--        :input-value="value"-->
      <!--        @change="(e) => changeItem(e)"-->
      <!--      />-->
    </template>
  </FieldLayout>
</template>

<style lang="scss">
@import '@design';

.checkboxContainer {
  position: relative;
  display: block;
  font-size: 14px;
  cursor: pointer;
  -webkit-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}
.checkboxContainer input {
  position: absolute;
  width: 0;
  height: 0;
  cursor: pointer;
  opacity: 0;
}
.checkboxMark {
  position: absolute;
  top: 0;
  left: 0;
  width: 17px;
  height: 17px;
  background-color: #fff;
  border: 2px solid rgba(0, 0, 0, 0.38);
  border-radius: 15%;
}
.checkboxContainer:hover input ~ .checkboxMark {
  background-color: #b3d4fc;
}
.checkboxContainer input:checked ~ .checkboxMark {
  background-color: #0037ee;
  border: none;
}
.checkboxMark::after {
  position: absolute;
  display: none;
  content: '';
}
.checkboxContainer .checkboxMark::after {
  top: 2px;
  left: 6px;
  width: 5px;
  height: 10px;
  border: solid white;
  border-width: 0 2px 2px 0;
  -webkit-transform: rotate(45deg);
  -ms-transform: rotate(45deg);
  transform: rotate(45deg);
}
.checkboxContainer input:checked ~ .checkboxMark::after {
  display: block;
}
</style>
