<script>
export default {
  name: 'ColorPicker',
  model: {
    prop: 'value',
    event: 'change',
  },
  props: {
    value: { type: [String], default: null },
  },
  data() {
    return {
      menu: false,
      swatches: [
        ['#FF0000', '#AA0000', '#550000'],
        ['#FFFF00', '#AAAA00', '#555500'],
        ['#00FF00', '#00AA00', '#005500'],
        ['#00FFFF', '#00AAAA', '#005555'],
        ['#0000FF', '#0000AA', '#000055'],
      ],
    }
  },
  computed: {
    color: {
      get() {
        return this.value
      },
      set(v) {
        this.value = v
      },
    },
    swatchStyle() {
      return {
        cursor: 'pointer',
        height: '25px',
        width: '25px',
        borderRadius: '50%',
        border: '1px solid grey',
        backgroundColor: this.color,
      }
    },
  },
  methods: {
    input(value) {
      if (typeof value === 'string') {
        this.$emit('change', value)
      } else if (typeof value === 'object') {
        this.$emit('change', value.hex)
      }
    },
  },
}
</script>

<template>
  <v-menu
    v-model="menu"
    top
    nudge-bottom="100"
    nudge-left="15"
    :close-on-content-click="false"
  >
    <template v-slot:activator="{ on }">
      <div :style="swatchStyle" v-on="on" />
    </template>
    <v-card>
      <v-color-picker
        :value="color"
        flat
        hide-canvas
        hide-mode-switch
        mode="hexa"
        :swatches="swatches"
        @input="input"
      />
    </v-card>
  </v-menu>
</template>
