<script>
export default {
  name: 'ProfilePage',
  data() {
    return {
      menu: false,
    }
  },
  computed: {
    userInfo() {
      if (this.$store.state.auth.currentUser)
        return this.$store.state.auth.currentUser
      else
        return {
          firstName: 'Nova',
          lastName: 'Lets',
          userName: 'letsnova',
          email: 'letsnova@letsnova.ru',
        }
    },
  },
}
</script>

<template>
  <v-menu
    v-model="menu"
    :close-on-content-click="false"
    :nudge-width="300"
    offset-x
    offset-y
  >
    <template v-slot:activator="{ on }">
      <v-btn icon dark v-on="on">
        <v-avatar color="white" size="35">
          <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
        </v-avatar>
      </v-btn>
    </template>

    <v-card>
      <v-list avatar>
        <v-list-item>
          <v-list-item-avatar>
            <v-img src="https://cdn.vuetifyjs.com/images/john.png"></v-img>
          </v-list-item-avatar>

          <v-list-item-content>
            <v-list-item-title>{{
              `${userInfo.firstName} ${userInfo.lastName}`
            }}</v-list-item-title>
            <v-list-item-subtitle>{{ userInfo.username }}</v-list-item-subtitle>
            <v-row>
              <v-col sm="5" md="3" lg="3" xl="3">
                <span class="subtitle-2 font-weight-bold color-grey"
                  >E-mail:</span
                >
              </v-col>
              <v-col>
                <span class="subtitle-2 body-2 pl-2">{{ userInfo.email }}</span>
              </v-col>
            </v-row>
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-card>
  </v-menu>
</template>

<style lang="scss" module>
@import '@design';
</style>
