interface Store {
  [key: string]: any
}

export class KeyValueStore {
  private store: Store = {}

  public init = () => null

  public set = (key: string, value: any): void => {
    this.store[key] = value
  }

  public get = (key: string): any => {
    return this.store[key]
  }

  public delete = (key: string): void => {
    this.store[key] = undefined
  }
}
