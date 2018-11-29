import * as path from 'path'
import * as shell from 'shelljs'

import { KeyValueStore } from '../key-value-store'

describe('KeyValueStore', () => {
  const testKey1 = 'test-key-1'
  const testValue1 = 'test-value-1'
  const testValue2 = 'test-value-2'

  const dbTempPath = path.resolve(__dirname, '../../db_temp')

  let keyValueStore = null
  let dbPath: string = null
  let testId = 1

  beforeAll(() => {
    expect(dbTempPath.endsWith('db_temp')).toBeTruthy()

    shell.rm('-rf', dbTempPath)
  })

  beforeEach(() => {
    dbPath = path.resolve(
      dbTempPath,
      process.pid.toString() + '_' + (testId++).toString(),
    )
    shell.mkdir('-p', dbPath)

    keyValueStore = new KeyValueStore({ dbPath })
    keyValueStore.init()
  })

  it('get() returns value that was set()', () => {
    keyValueStore.set(testKey1, testValue1)

    expect(keyValueStore.get(testKey1)).toEqual(testValue1)
  })

  it('get() returns last value that was set()', () => {
    keyValueStore.set(testKey1, testValue1)
    keyValueStore.set(testKey1, testValue2)

    expect(keyValueStore.get(testKey1)).toEqual(testValue2)
  })

  it('get() for non-existent key returns undefined', () => {
    expect(keyValueStore.get(testKey1)).toBeUndefined()
  })

  it('set() and get() support null value', () => {
    keyValueStore.set(testKey1, null)

    expect(keyValueStore.get(testKey1)).toBeNull()
  })

  it('delete() for key causes get() to return undefined', () => {
    keyValueStore.set(testKey1, testValue1)
    keyValueStore.delete(testKey1)

    expect(keyValueStore.get(testKey1)).toBeUndefined()
  })
})
