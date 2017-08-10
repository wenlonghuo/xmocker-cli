'use strict'
const program = require('commander')
const dealer = require('./commands/free')

program
  .parse(process.argv)

dealer(program)
