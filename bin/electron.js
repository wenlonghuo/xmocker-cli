const electron = require('electron')
const app = electron.app
const BrowserWindow = electron.BrowserWindow

var window = null

var proc = require('../app/index.js')

app.on('ready', function () {
  window = new BrowserWindow({
    width: 1280,
    height: 700,
  })
  proc.then(() => {
    window.loadURL('http://localhost:6001')
  })
})
