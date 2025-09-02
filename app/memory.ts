type MemoryStateData =
  | {
      type: "string";
      value: string | string[];
    }
  | {
      type: "stream";
      id: string;
      value: Map<string, string>;
    };

type MemoryState = {
  data: MemoryStateData;
  createdDate: Date;
  expirationTime?: number;
};

export class MemoryStore {
  private store: Map<string, MemoryState>;

  constructor() {
    this.store = new Map();
  }

  set(params: {
    key: string;
    data: MemoryStateData;
    options?: { expirationTime?: number };
  }): void {
    this.store.set(params.key, {
      data: params.data,
      expirationTime: params?.options?.expirationTime,
      createdDate: new Date(),
    });
  }

  get(key: string): MemoryStateData | undefined {
    const item = this.store.get(key);

    if (item) {
      if (!item.expirationTime) return item.data;
      else if (
        item.expirationTime &&
        item.createdDate.getTime() + item.expirationTime > new Date().getTime()
      ) {
        return item.data;
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
