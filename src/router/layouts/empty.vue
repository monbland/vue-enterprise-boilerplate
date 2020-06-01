<template>
  <div id="app">
    <v-app id="inspire">
      <slot />
    </v-app>
  </div>
</template>

<style lang="scss" module>
@import '@design';

.container {
  min-width: $size-content-width-min;
  max-width: $size-content-width-max;
  margin: 0 auto;
}
</style>
