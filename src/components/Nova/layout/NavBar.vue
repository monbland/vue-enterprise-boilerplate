<script>
import sidebarLinks from '@nova/SidebarLinks.js'
export default {
  computed: {
    sidebarLinks: () => {
      return sidebarLinks
    },
    getWindowWidth() {
      return window.innerWidth
    },
  },
}
</script>

<template>
  <v-navigation-drawer
    :value="$store.state.layout.drawer"
    app
    stateless
    :temporary="getWindowWidth < 1265"
  >
    <v-list dense>
      <div v-for="(item, index) in sidebarLinks" :key="index">
        <v-list-item
          v-if="!item.children"
          :key="index"
          :to="{
            name: item.name,
            params: item.params ? item.params : '',
          }"
          link
          @click.stop="$store.commit('layout/toggleLeftBar', false)"
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title
              ><span v-translate>{{ item.title }}</span></v-list-item-title
            >
          </v-list-item-content>
        </v-list-item>
        <v-list-group v-else :key="item.title" value="true">
          <template v-slot:activator>
            <v-list-item class="pl-0" :to="item.path">
              <v-list-item-action>
                <v-icon>{{ item.icon }}</v-icon>
              </v-list-item-action>
              <v-list-item-content>
                <v-list-item-title
                  ><span v-translate>{{ item.title }}</span></v-list-item-title
                >
              </v-list-item-content>
            </v-list-item>
          </template>

          <v-list-item
            v-for="subItem in item.children"
            :key="subItem.title"
            :to="{ path: subItem.path }"
            @click.stop="$store.commit('layout/toggleLeftBar', false)"
          >
            <v-list-item-action>
              <v-icon>{{ subItem.icon }}</v-icon>
            </v-list-item-action>
            <v-list-item-content>
              <v-list-item-title
                ><span v-translate>{{ subItem.title }}</span></v-list-item-title
              >
            </v-list-item-content>
          </v-list-item>
        </v-list-group>
      </div>
    </v-list>
  </v-navigation-drawer>
</template>
