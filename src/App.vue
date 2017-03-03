<template>
  <div id="app">
    <nav-bar></nav-bar>
    <transition name="slide-left" mode="out-in">
      <router-view id="main-router-view" class="aaa"></router-view>
    </transition>
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
            this.appBase = data.data.result || {}
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

::-webkit-scrollbar {  
  width: 4px; 
}

/*定义滚动条轨道 内阴影+圆角*/  
::-webkit-scrollbar-track {  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,0.3);  
  border-radius: 10px;
}  

/*定义滑块 内阴影+圆角*/  
::-webkit-scrollbar-thumb {  
  border-radius: 10px;  
  -webkit-box-shadow: inset 0 0 6px rgba(0,0,0,.3);
}

/*.slide-left-enter, .slide-left-leave-active {
  transform: translate3d(100%, 0, 0);
}
.slide-left-enter-active, .slide-left-leave {
  transition: transform 1s;
}*/
.aaa {
  transition: all .2s cubic-bezier(.55, 0, .11, 1);
}
.slide-left-enter, .slide-right-leave-active{
    opacity: 0;
    transform: translate(30px, 0);
}
.slide-left-leave-active, .slide-right-enter{
    opacity: 0;
    transform: translate(-30px, 0);
}
</style>