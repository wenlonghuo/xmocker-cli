class socket {
  container = {}
  constructor (store) {
    this.store = store
    this.unSendList = []
  }
  init ({port = 6001}) {
    let socket
    socket = new WebSocket(`ws://${window.location.hostname}:${port}`)
    socket.onopen = event => {
      this.socket = socket
      if (this.unSendList.length) {
        this.unSendList.forEach(item => {
          this.socket.send(item)
        })
      }
      this.unSendList = []
      socket.onmessage = msg => {
        try {
          var data = JSON.parse(msg.data)
        } catch (e) {

        }
        if (!data) return
        let id = data.id
        if (!id) {
          this.savePush(data)
        } else {
          let hook = this.container[id]
          if (!hook) return
          hook.resolve(data)
          delete this.container[id]
        }
      }
    }

    socket.onclose = e => {
      setTimeout(this.init, 5000)
    }

    socket.onerror = e => {
      // setTimeout(_this.initSocket, 5000)
    }
  }
  send (option) {
    return new Promise((resolve, reject) => {
      option.id = +new Date()
      this.container[option.id] = {resolve, reject}
      let str = JSON.stringify(option)
      if (this.socket) {
        this.socket.send(str)
      } else {
        this.unSendList.push(str)
      }
    })
  }
  savePush (data) {
    let type = data.type
    let action = data.action
    this.store.commit(type + '/' + action, data)
  }
}

export default socket
