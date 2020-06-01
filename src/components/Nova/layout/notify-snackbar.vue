<script>
export default {
  name: 'NotifySnackbar',
  props: {
    value: {
      type: Object,
      default: () => {},
    },
  },
}
</script>

<template>
  <v-snackbar
    v-model="value.show"
    :color="value.color"
    :timeout="value.timeout"
    :top="value.top"
    :right="value.right"
  >
    <span class="body-1">{{ value.text }}</span>
    <v-btn icon dark @click="value.show = false">
      <v-icon>mdi-close</v-icon>
    </v-btn>
  </v-snackbar>
</template>

<style lang="scss" module>
@import '@design';
</style>
