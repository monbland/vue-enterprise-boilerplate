<script>
import NavBar from '@nova/layout/NavBar.vue'
import AppBar from '@nova/layout/AppBar.vue'

export default {
  name: 'Main',
  components: {
    NavBar,
    AppBar,
  },

  computed: {
    getCurrentYear: () => {
      const year = new Date()
      return year.getFullYear()
    },
  },
}
</script>

<template>
  <v-app id="inspire">
    <NavBar />
    <AppBar />
    <slot />
    <v-footer app>
      <span>&copy; {{ getCurrentYear }}</span>
    </v-footer>
  </v-app>
</template>

<style lang="scss" module>
@import '@design';

.container {
  min-width: $size-content-width-min;
  max-width: $size-content-width-max;
  margin: 0 auto;
}
</style>
