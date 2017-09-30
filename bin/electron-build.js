'use strict'
const packager = require('electron-packager')
const path = require('path')
const parent = path.join(__dirname, '../')
const options = {
  dir: parent,
  platform: process.platform,
  arch: 'x64',
  name: 'xmocker',
  ignore: [
    /web\/node_modules\//,
    /lower\//,
    /xmocker\//,
    /xmocker.*/,
  ],
  out: parent,
}
packager(options)
