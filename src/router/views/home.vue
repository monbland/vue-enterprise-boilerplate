<script>
import appConfig from '@src/app.config'
import Layout from '@layouts/main.vue'

export default {
  name: 'Home',
  components: {
    Layout,
  },
  data: () => ({
    drawer: null,
  }),
  page: {
    title: 'Home',
    meta: [{ name: 'description', content: appConfig.description }],
  },
  computed: {
    getWindowWidth() {
      return window.innerWidth
    },
  },
  created() {},
}
</script>

<template>
  <Layout>
    <v-content>
      <router-view name="mainView" />
    </v-content>

    <v-navigation-drawer
      v-if="false"
      app
      clipped
      right
      stateless
      :temporary="getWindowWidth < 1265"
      :width="getWindowWidth < 800 ? '100%' : '31%'"
    >
      <router-view name="inspectorView" />
    </v-navigation-drawer>
  </Layout>
</template>
