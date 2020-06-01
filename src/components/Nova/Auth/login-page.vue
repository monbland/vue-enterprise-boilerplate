<script>
import { authMethods } from '@state/helpers'
export default {
  name: 'Login',
  data() {
    return {
      testClass: false,
      username: '',
      password: '',
      authError: null,
      show: false,
      nameRules: [
        (v) => !!v || this.$gettext('Имя пользователя не может быть пустым'),
      ],
      passRules: [(v) => !!v || this.$gettext('Пароль не может быть пустым')],
    }
  },
  computed: {
    checkField() {
      return (this.username && this.password) === ''
    },
  },
  methods: {
    ...authMethods,
    // Try to log the user in with the username
    // and password they provided.
    async tryToLogIn() {
      this.tryingToLogIn = true
      // Reset the authError if it existed.
      this.authError = null
      // пытаемся залогиниться
      try {
        await this.logIn({
          username: this.username,
          password: this.password,
        })
        // если мы на странице логина оказались из-за переадресации
        if (this.$route.query.redirectFrom) {
          // то вернемся туда, откуда нас сюда выкинуло
          this.$router.replace(this.$route.query.redirectFrom)
        }
      } catch (error) {
        if (error.isAxiosError) {
          this.authError =
            typeof error.response.data === 'string'
              ? error.response.data
              : error.response.data.detail
        } else {
          this.authError = error
        }
      }
      this.tryingToLogIn = false
    },
  },
}
</script>

<template>
  <v-app>
    <v-container fluid>
      <v-row justify="center">
        <v-col cols="12" md="5" class="mb-1 text-center">
          <img src="@/public/images/nova.png" />
        </v-col>
      </v-row>
      <v-row align="center" justify="center">
        <v-col cols="12" sm="8" md="4" :class="{ swing: authError }">
          <v-card class="elevation-12">
            <v-toolbar color="#0037EE" dark flat>
              <v-toolbar-title v-translate>Авторизация</v-toolbar-title>
            </v-toolbar>
            <v-card-text>
              <v-form @keyup.native.enter="tryToLogIn">
                <v-text-field
                  v-model="username"
                  :rules="nameRules"
                  :label="'Имя пользователя' | translate"
                  name="username"
                  autofocus
                  prepend-inner-icon="mdi-account"
                  type="text"
                  outlined
                />
                <v-text-field
                  v-model="password"
                  :rules="passRules"
                  prepend-inner-icon="mdi-lock"
                  :append-icon="show ? 'mdi-eye' : 'mdi-eye-off'"
                  :type="show ? 'text' : 'password'"
                  name="password"
                  outlined
                  :label="'Пароль' | translate"
                  @click:append="show = !show"
                />
                <v-checkbox
                  :label="'Запомнить меня' | translate"
                  color="#0037EE"
                  class="my-0"
                  value="red"
                  hide-details
                  :disabled="checkField"
                />
              </v-form>
              <v-alert
                v-if="authError"
                dense
                text
                type="error"
                class="mb-0 mt-3"
              >
                <translate>Ошибка!</translate>
                {{ authError }}
              </v-alert>
            </v-card-text>
            <v-card-actions class="justify-end px-4">
              <v-btn
                type="submit"
                :dark="!checkField"
                color="#0037EE"
                block
                :disabled="checkField"
                @click="tryToLogIn"
              >
                <translate>Войти</translate>
              </v-btn>
            </v-card-actions>
          </v-card>
        </v-col>
      </v-row>
    </v-container>
  </v-app>
</template>

<style lang="scss" scoped>
@import '@design';
@-webkit-keyframes swing {
  15% {
    -webkit-transform: translateX(9px);
    transform: translateX(9px);
  }
  30% {
    -webkit-transform: translateX(-9px);
    transform: translateX(-9px);
  }
  40% {
    -webkit-transform: translateX(6px);
    transform: translateX(6px);
  }
  50% {
    -webkit-transform: translateX(-6px);
    transform: translateX(-6px);
  }
  65% {
    -webkit-transform: translateX(3px);
    transform: translateX(3px);
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
}

@keyframes swing {
  15% {
    -webkit-transform: translateX(9px);
    transform: translateX(9px);
  }
  30% {
    -webkit-transform: translateX(-9px);
    transform: translateX(-9px);
  }
  40% {
    -webkit-transform: translateX(6px);
    transform: translateX(6px);
  }
  50% {
    -webkit-transform: translateX(-6px);
    transform: translateX(-6px);
  }
  65% {
    -webkit-transform: translateX(3px);
    transform: translateX(3px);
  }
  100% {
    -webkit-transform: translateX(0);
    transform: translateX(0);
  }
}
.swing {
  -webkit-animation: swing 0.6s ease;
  animation: swing 0.6s ease;
  -webkit-animation-iteration-count: 1;
  animation-iteration-count: 1;
}
</style>
