'use strict'
const program = require('commander')
const dealer = require('./commands/exit')

program
  .parse(process.argv)

dealer(program)

