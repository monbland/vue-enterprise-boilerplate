<script>
import ProfilePage from './profile-page.vue'

export default {
  components: { ProfilePage },
  methods: {
    logOut() {
      this.$router.replace({ name: 'logout' })
    },
  },
}
</script>

<template>
  <v-app-bar
    class="elevation-0"
    color="#0037EE"
    height="48"
    app
    clipped-right
    dark
    style="z-index: 999"
  >
    <v-app-bar-nav-icon
      @click.stop="
        $store.commit('layout/toggleLeftBar', !$store.state.layout.drawer)
      "
    />
    <v-toolbar-title />
    <v-spacer />
    <v-tooltip bottom>
      <template v-slot:activator="{ on }">
        <v-btn icon v-on="on" @click="logOut">
          <v-icon>mdi-logout-variant</v-icon>
        </v-btn>
      </template>
      <span v-translate>Выйти</span>
    </v-tooltip>
    <v-btn icon>
      <v-icon>mdi-bell</v-icon>
    </v-btn>
    <ProfilePage />
  </v-app-bar>
</template>
