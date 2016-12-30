<template>
  <div id="app">
    <nav-bar></nav-bar>
    <router-view id="main-router-view"></router-view>
  </div>
</template>

<script>
  var Vue = require('vue')
  var VueMaterial = require('vue-material')
  require('vue-material/dist/vue-material.css')

  Vue.use(VueMaterial)

  import VueResource from 'vue-resource'
  Vue.use(VueResource);


  import navBar from './components/nav-bar.vue'

  Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'red',
    warn: 'red',
    background: 'white'
  })

  Vue.material.registerTheme('menu', {
    primary: 'white',
    accent: 'red',
    warn: 'red',
    background: 'white'
  })

  export default {
    name: 'app',
    components: {
      "nav-bar": navBar,
    },
  }
</script>

<style>

</style>