#! /usr/bin/env node
import * as initCommand from './commands/init'
import * as pullCommand from './commands/pull'

// eslint-disable-next-line no-unused-expressions
require('yargs')
  .scriptName('shh')
  .usage('$0 <cmd> [args]')
  .command(initCommand)
  .command(pullCommand)
  .help().argv
