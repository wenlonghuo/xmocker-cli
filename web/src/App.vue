<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>

<script>
import { getBase } from './api/api.js'
export default {
  name: 'app',
  created () {
    this.initSocket()
  },
  methods: {
    initSocket () {
      getBase().then(data => {
        let port = 6001
        if (!data.code) {
          port = data.data.managePort || 6001
        }
        this.$socket.init({ port })
      })
    },
  },
}
</script>
