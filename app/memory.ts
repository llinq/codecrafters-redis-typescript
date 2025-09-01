type MemoryStateType = "string" | "object" | "stream";

type MemoryState<T = unknown> = {
  value: T;
  type: MemoryStateType;
  createdDate: Date;
  expirationTime?: number;
};

export class MemoryStore {
  private store: Map<string, MemoryState>;

  constructor() {
    this.store = new Map();
  }

  set(
    key: string,
    value: unknown,
    options: { type?: MemoryStateType; expirationTime?: number } = {}
  ): void {
    this.store.set(key, {
      value,
      expirationTime: options.expirationTime,
      createdDate: new Date(),
      type: options.type ?? "string",
    });
  }

  get<T = string>(key: string): MemoryState<T> | undefined {
    const item = this.store.get(key);
    if (item) {
      if (!item.expirationTime) return <MemoryState<T>>item;
      else if (
        item.expirationTime &&
        item.createdDate.getTime() + item.expirationTime > new Date().getTime()
      ) {
        return <MemoryState<T>>item;
      } else {
        this.delete(key);
      }
    }
  }

  delete(key: string): boolean {
    return this.store.delete(key);
  }

  has(key: string): boolean {
    return this.store.has(key);
  }
}
