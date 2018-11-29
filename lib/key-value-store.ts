import * as fs from 'fs'
import * as path from 'path'
import * as shell from 'shelljs'
import * as stringHash from 'string-hash'

interface Store {
  [key: string]: any
}

interface Options {
  dbPath: string
}

const VALUE_INDEX = 0
const KEY_INDEX = 1

export class KeyValueStore {
  private store: Store = {}
  private dbPath: string

  public constructor({ dbPath }: Options) {
    this.dbPath = dbPath
  }

  public init = (): void => {
    shell.mkdir('-p', this.dbPath)
  }

  public set = (key: string, value: any): void => {
    fs.writeFileSync(
      this.filePath(key),
      JSON.stringify([value, key]),
    )
  }

  public get = (key: string): any => {
    const filePath = this.filePath(key)

    if (!fs.existsSync(filePath)) {
      return undefined
    }

    const entry = JSON.parse(
      fs.readFileSync(filePath).toString(),
    )

    if (entry[KEY_INDEX] !== key) {
      throw new Error(
        `Keys do not match: '${
          entry[KEY_INDEX]
        }' !== '${key}' -- probably a hash collision.`,
      )
    }

    return entry[VALUE_INDEX]
  }

  public delete = (key: string): void => {
    const filePath = this.filePath(key)

    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath)
    }
  }

  private filePath = (key: string): string => {
    const keyHash = stringHash(key)
    const fileName = `${keyHash}.json`

    return path.resolve(this.dbPath, fileName)
  }
}
