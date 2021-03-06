import { Suite } from 'benchmark'
import * as path from 'path'
import * as shell from 'shelljs'

import { KeyValueStore } from './key-value-store'

/* tslint:disable no-console */

const bytesPerMB = 1024 * 1024
const maxItems = 500

function run() {
  const dbPath = path.resolve(__dirname, '../db_bench')

  if (!dbPath.includes('db_bench')) {
    throw new Error(
      `Refusing to run benchmarks for db path not containing 'db_bench': ${dbPath}`,
    )
  }

  shell.rm('-rf', dbPath)
  shell.mkdir('-p', dbPath)

  const keyValueStore = new KeyValueStore({ dbPath })
  const suite = new Suite()

  const startingRss = process.memoryUsage().rss
  console.log(`Starting RSS memory usage: ${bytesToMB(startingRss)} MB`)

  keyValueStore.init()

  suite
    .add('KeyValueStore#set', () => {
      keyValueStore.set(Math.floor(Math.random() * maxItems).toString(), Math.random().toString())
    })
    .add('KeyValueStore#get', () => {
      keyValueStore.get(Math.floor(Math.random() * maxItems).toString())
    })
    .add('KeyValueStore#delete', () => {
      keyValueStore.delete(Math.floor(Math.random() * maxItems).toString())
    })
    .on('cycle', (event) => {
      console.log(String(event.target))
    })
    .on('complete', () => {
      const endingRss = process.memoryUsage().rss
      console.log(`Ending RSS memory usage: ${bytesToMB(endingRss)} MB`)
      console.log(`Difference: ${bytesToMB(endingRss - startingRss)} MB`)
    })
    .on('error', (err) => {
      console.error(err)
    })
    .run({ maxTime: 3, async: true })
}

function bytesToMB(bytes) {
  return (bytes / bytesPerMB).toFixed(3)
}

export { run }

if (!module.parent) {
  run()
}
