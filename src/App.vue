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
  Vue.use(VueResource)

  import navBar from './components/nav-bar.vue'

  Vue.material.registerTheme('default', {
    primary: 'blue',
    accent: 'red',
    warn: 'red',
    background: 'white',
  })

  Vue.material.registerTheme('menu', {
    primary: 'white',
    accent: 'red',
    warn: 'red',
    background: 'white',
  })

  Vue.material.registerTheme({
    rightbar: {
      primary: 'orange',
      accent: 'teal',
      warn: 'white',
    },
  })

  export default {
    name: 'app',
    components: {
      'nav-bar': navBar,
    },
    data: function () {
      return {
        appBase: {},
        socket: null,
      }
    },
    watch: {
      '$store.state.ws.cmd': function (val) {
        this.execCmd()
      },
    },
    created: function () {
      this.app = this.$resource('', {}, {
        get: {
          method: 'GET',
          url: '/mock/getAppBase',
        },
      })
      this.getBaseInfo().then(function () {
        this.initSocket()
      })
    },
    mounted: function () {

    },
    methods: {
      initSocket: function () {
        var socket = new WebSocket('ws://localhost:' + (this.appBase.managePort || 6001))
        var _this = this
        socket.onopen = function (event) {
          // socket.send('open now')
          _this.socket = socket
          socket.onmessage = function (msg) {
            try {
              var data = JSON.parse(msg.data)
            } catch (e) {

            }
            if (!data) return
            if (data._cmd) {
              try {
                _this.$store.commit(data._cmd, data.data)
              } catch (e) {

              }
            }
          }

          _this.execCmd()
        }

        socket.onclose = function (event) {
          setTimeout(_this.initSocket, 5000)
        }

        socket.onerror = function (event) {
          // setTimeout(_this.initSocket, 5000)
        }
      },
      getBaseInfo: function () {
        return this.app.get({}).then(function (r) {
          var data = r.data
          if (!data.code) {
            this.appBase = data.data.result
          }
        })
      },
      execCmd: function () {
        var cmd = this.$store.state.ws.cmd[0]
        if (cmd) {
          if (this.socket) {
            if (this.socket.readyState === 1) {
              this.$store.commit('shiftCmd')
              this.socket.send(JSON.stringify(cmd))
            }
          }
        }
      },
    },
  }
</script>

<style>

</style>