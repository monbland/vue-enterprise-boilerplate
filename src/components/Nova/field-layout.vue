<script>
export default {
  /**
   * Лэйаут для филдов инспектора
   * два слота -
   * title - для названия в левой стороне
   * content - для содержимого (текстфилд, селект и т.д.)
   */
}
</script>

<template>
  <v-col cols="12" class="py-1">
    <v-row>
      <v-col
        cols="12"
        md="4"
        class="subtitle-2 font-weight-bold color-grey py-0 py-md-1 pr-0"
      >
        <slot name="title"></slot>
      </v-col>
      <v-col
        cols="12"
        md="8"
        class="subtitle-2 font-weight-regular py-0 py-md-1 pl-5 pl-md-0 text-sm-end text-md-start"
      >
        <slot name="content"></slot>
      </v-col>
    </v-row>
  </v-col>
</template>

<style lang="scss">
@import '@design';
</style>
