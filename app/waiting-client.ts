const WAITING_CLIENTS = new Map<string, WaitingClient[]>();

export class WaitingClient {
  private _resolve!: (key: string) => void;
  private _reject!: () => void;
  private _timeoutId?: NodeJS.Timeout;

  key: string;
  timeout: number;
  promise: Promise<string>;

  constructor(key: string, timeout: number) {
    this.key = key;
    this.timeout = timeout;

    this.promise = new Promise<string>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    if (timeout !== Infinity) {
      this._timeoutId = setTimeout(() => {
        this.reject();
      }, this.timeout);
    }
  }

  static dequeue(key: string) {
    const clientsForKey = WAITING_CLIENTS.get(key);

    if (!clientsForKey || clientsForKey.length === 0) return;

    return clientsForKey.shift();
  }

  static clearAll() {
    for (const clients of WAITING_CLIENTS.values()) {
      clients.forEach((client) => client.reject());
    }
  }

  queue() {
    const clientsForKey = WAITING_CLIENTS.get(this.key) || [];
    clientsForKey.push(this);
    WAITING_CLIENTS.set(this.key, clientsForKey);
  }

  resolve(key: string) {
    this.clear();
    this._resolve(key);
  }

  reject() {
    this.clear();
    this._reject();
  }

  clear() {
    if (this._timeoutId) clearInterval(this._timeoutId);
  }
}
