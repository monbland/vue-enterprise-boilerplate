<script>
/**
   * @file - компонент диалога подтверждения
   * ниже пример использования как диалог удаления
   * this.confirmDialog = {
        show: true,
        confirmText: this.$gettext('Подтвердить удаление'),
        declineText: this.$gettext('Отменить'),
        item: {},
        text: this.$gettext(
          `Вы точно хотите удалить ${item.name ? item.name : item.id}?`
        ),
        confirm: () => this.remove(item, type),
      }
   */
export default {
  name: 'ConfirmDialog',
  props: {
    value: {
      type: Object,
      default() {
        return {
          show: false,
          confirmText: this.$gettext('Подтвердить'),
          declineText: this.$gettext('Отменить'),
          item: {},
          text: this.$gettext('Вы уверены?'),
          confirm() {
            return null
          },
        }
      },
    },
  },
  methods: {
    /**
     * Закрытие диалогового окна
     */
    closeConfirmDialog() {
      this.value.show = false
    },
    /**
     * Подтверждение удаления
     */
    confirm() {
      this.value.confirm()
      this.closeConfirmDialog()
    },
  },
}
</script>

<template>
  <v-dialog v-model="value.show" max-width="500">
    <v-card>
      <div>
        <v-col class="text-end pt-2 pb-0">
          <v-btn icon small @click="closeConfirmDialog">
            <v-icon>mdi-close</v-icon>
          </v-btn>
        </v-col>
      </div>
      <v-card-title class="headline pt-0">
        <v-row>
          <v-col class="text-center" cols="12">
            <span>{{ value.text }}</span>
          </v-col>
        </v-row>
      </v-card-title>
      <v-card-actions>
        <v-spacer></v-spacer>
        <v-btn v-translate color="red" dark @click="confirm">
          {{ value.confirmText }}
        </v-btn>
        <v-btn v-translate color="#0037EE" dark @click="closeConfirmDialog">
          {{ value.declineText }}
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>

<style lang="scss" module>
@import '@design';
</style>
