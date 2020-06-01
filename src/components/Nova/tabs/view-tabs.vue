<script>
export default {
  props: {
    /**
     * tabs - массив объектов, свойства:
     * title - заголовок вкладки
     * to - адрес назначения
     */
    tabs: {
      type: Array,
      default: function() {
        return []
      },
    },
    // размеры табов для адаптиности
    cols: {
      type: Number,
      default: 12,
    },
    colsMd: {
      type: Number,
      default: 6,
    },
    colsLg: {
      type: Number,
      default: 3,
    },
  },
  data() {
    return {}
  },
  computed: {
    /**
     * Возвращаем текущий View
     * @returns {*}
     */
    currentView() {
      return this.tabs.findIndex((view) => view.to === this.$route.name)
    },
  },
  methods: {
    /**
     * Меняем текущий View
     * @param to - адрес View
     */
    changeView(to) {
      if (this.$route.name !== to) this.$router.push({ name: to })
    },
  },
}
</script>

<template>
  <div>
    <v-row class="d-none d-md-flex">
      <v-col
        v-for="(item, index) in tabs"
        :key="index"
        :cols="cols"
        :md="colsMd"
        :lg="colsLg"
      >
        <div
          class="d-flex viewTabs align-center justify-center text-center"
          :class="{ active: currentView === index }"
          @click="changeView(item.to, index)"
        >
          <span class="font-weight-medium" style="font-size: 13px">{{
            item.title
          }}</span>
        </div>
      </v-col>
    </v-row>
    <v-row class="d-flex d-sm-flex d-md-none">
      <v-col>
        <v-expansion-panels focusable flat multiple>
          <v-expansion-panel class="n-bordered">
            <v-expansion-panel-header disable-icon-rotate color="#0037ee">
              <template v-slot:actions>
                <v-icon color="#ffffff">mdi-menu</v-icon>
              </template>
            </v-expansion-panel-header>
            <v-expansion-panel-content>
              <v-list dense>
                <v-list-item-group color="#0037ee">
                  <v-list-item
                    v-for="(item, index) in tabs"
                    :key="index"
                    :class="{ active: currentView === index }"
                    @click="changeView(item.to, index)"
                  >
                    <v-list-item-content
                      :style="{ color: currentView === index ? '#ffffff' : '' }"
                    >
                      <v-list-item-title>
                        {{ item.title }}
                      </v-list-item-title>
                    </v-list-item-content>
                  </v-list-item>
                </v-list-item-group>
              </v-list>
            </v-expansion-panel-content>
          </v-expansion-panel>
        </v-expansion-panels>
      </v-col>
    </v-row>
  </div>
</template>

<style lang="scss">
@import '@design';

.viewTabs {
  height: 100%;
  padding: 8px 16px;
  color: #0037ee;
  border: 1px solid #0037ee;
  border-radius: 5px;
  transition: background-color 0.1s;
}
.viewTabs:hover {
  cursor: pointer;
  background: rgb(63, 81, 181, 0.1);
}
.viewTabs:active {
  background-color: rgb(63, 81, 181, 0.3);
}
.viewTabs.active {
  color: #fff;
  background-color: #0037ee;
}
.active {
  background-color: #0037ee;
}
</style>
