<script>
export default {
  name: 'ModalDialog',
  props: {
    show: { type: Boolean, default: false },
    width: { type: String, default: '500px' },
    type: { type: String, default: '' },
    classifier: { type: Boolean, default: false },
  },
  data() {
    return {
      valid: true,
    }
  },
  methods: {
    close() {
      this.$emit('close')
    },
    add() {
      const formValid = this.$refs.form.validate()
      if (formValid)
        // ждем срабатывания @input у combobox
        setTimeout(() => this.$emit('add'), 0)
    },
    addClassifier() {
      this.$emit('addClassifier')
    },
  },
}
</script>

<template>
  <v-dialog v-model="show" persistent :max-width="width">
    <v-form ref="form" v-model="valid">
      <v-card>
        <div>
          <v-col class="text-end py-2">
            <v-btn icon small @click="close">
              <v-icon>mdi-close</v-icon>
            </v-btn>
          </v-col>
        </div>
        <slot name="component" />
        <div v-if="type !== 'DialogClassifier'" class="px-10 pb-10">
          <v-row>
            <slot name="buttons">
              <v-col class="py-2">
                <v-btn color="#0037EE" small dark block @click="add"
                  ><translate>Добавить</translate></v-btn
                >
              </v-col>
              <v-col v-if="classifier" class="py-2">
                <v-btn color="#BFBFBF" small dark block @click="addClassifier">
                  <translate>Выбрать из классификатора</translate>
                </v-btn>
              </v-col>
            </slot>
          </v-row>
        </div>
        <div v-else>
          <v-row class="mx-0">
            <v-col class="text-end px-10">
              <v-btn color="#0037EE" small dark>
                <translate>Добавить</translate>
              </v-btn>
            </v-col>
          </v-row>
        </div>
      </v-card>
    </v-form>
  </v-dialog>
</template>
