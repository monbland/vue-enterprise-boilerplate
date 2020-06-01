<script>
export default {
  name: 'Inspector',
  data() {
    return {
      inspector: false,
    }
  },
  computed: {
    /**
     * Получение текущего элемента, отображаемого в инспекторе
     * @return {null|{item: {}, type: null}|{item: {}, type: null}} - элемент из хранилища
     */
    inspectorItem() {
      if (this.$store.state.layout.inspector) {
        return this.$store.state.layout.currentInspectorItem
      } else {
        return null
      }
    },
  },
  methods: {
    /**
     * Выключатель инспектора
     */
    async closeInspector() {
      this.$store.commit(
        'layout/toggleRightBar',
        !this.$store.state.layout.inspector
      )
      await this.$router.replace({
        query: {},
      })
    },
    historyBack() {
      this.$router.go(-1)
    },
  },
}
</script>

<template>
  <div>
    <v-container class="px-md-5">
      <v-row>
        <v-btn icon @click.stop="historyBack">
          <v-icon>mdi-chevron-left</v-icon>
        </v-btn>
        <v-spacer />
        <v-btn icon @click.stop="closeInspector">
          <v-icon>mdi-close</v-icon>
        </v-btn>
      </v-row>
      <PortalTarget name="inspector" />
    </v-container>
    <!--    <div class="mt-md-12 changesContainer">-->
    <!--      <v-container>-->
    <!--        <v-row>-->
    <!--          <v-col-->
    <!--            v-translate-->
    <!--            class="subtitle-2 py-0 py-md-1 pt-md-4 px-md-5"-->
    <!--            cols="12"-->
    <!--          >-->
    <!--            История изменений-->
    <!--          </v-col>-->
    <!--          <v-col cols="12">-->
    <!--            <v-list :two-line="true" :dense="true">-->
    <!--              <v-list-item-group color="#0037EE">-->
    <!--                <v-list-item class="someoneDo">-->
    <!--                  <v-list-item-subtitle>-->
    <!--                    <span v-translate class="text&#45;&#45;primary"-->
    <!--                      >Кто-то сделал что-то</span-->
    <!--                    >-->
    <!--                    - 20.03.2020-->
    <!--                  </v-list-item-subtitle>-->
    <!--                </v-list-item>-->
    <!--                <v-list-item class="someoneDo">-->
    <!--                  <v-list-item-subtitle>-->
    <!--                    <span v-translate class="text&#45;&#45;primary"-->
    <!--                      >Someone do somethings</span-->
    <!--                    >-->
    <!--                    - 20.03.2020-->
    <!--                  </v-list-item-subtitle>-->
    <!--                </v-list-item>-->
    <!--              </v-list-item-group>-->
    <!--            </v-list>-->
    <!--          </v-col>-->
    <!--        </v-row>-->
    <!--      </v-container>-->
    <!--    </div>-->
    <!--    <v-container>-->
    <!--      <v-row>-->
    <!--        <v-col cols="12" class="subtitle-2">-->
    <!--          <span v-translate>Members:</span>-->
    <!--        </v-col>-->
    <!--      </v-row>-->
    <!--    </v-container>-->
  </div>
</template>

<style lang="scss" scoped>
.someoneDo {
  min-height: 20px;
}
.changesContainer {
  background-color: #00000008;
}
</style>
