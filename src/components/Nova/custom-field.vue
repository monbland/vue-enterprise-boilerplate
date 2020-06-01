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
     * Заголовок поля
     */
    title: {
      type: String,
      default: '',
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
      <slot name="custom-content">{{ title }}</slot>
    </template>
  </FieldLayout>
</template>

<style lang="scss" module>
@import '@design';
</style>
