type MemoryState = {
  value: unknown;
  createdDate: Date;
  expirationTime?: number;
};

export class MemoryStore {
  private store: Map<string, MemoryState>;

  constructor() {
    this.store = new Map();
  }

  set(key: string, value: unknown, expirationTime?: number): void {
    this.store.set(key, { value, expirationTime, createdDate: new Date() });
  }

  get(key: string): unknown | undefined {
    const item = this.store.get(key);
    if (item) {
      if (!item.expirationTime) return item.value;
      else if (
        item.expirationTime &&
        item.createdDate.getTime() + item.expirationTime > new Date().getTime()
      ) {
        return item.value;
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
