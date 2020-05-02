#!/usr/bin/env node

const concurrently = require('concurrently')
const glob = require('glob')
const { quote } = require('shlex')

const cmds = process.argv.slice(2).map(c => {
  let [, path, cmd = ''] = /^([^:]+):(.+)$/.exec(c) || []
  const [, cmd1, cmd2] = /^([^:]+):(.+)$/.exec(cmd) || []
  cmd = cmd2
    ? `${cmd1} run ${cmd2} --if-present`
    : cmd ? `if command -v ${quote(cmd)} > /dev/null; then ${cmd} fi` : ''

  return cmd ? glob.sync(path).map(p => [
    `cd ${quote(p)}`,
    cmd
  ].join(' && ')) : [c]
}).reduce((prev, c) => [...prev, ...c], [])

concurrently(cmds)
