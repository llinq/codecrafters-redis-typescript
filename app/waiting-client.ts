const WAITING_CLIENTS = new Map<string, WaitingClient[]>();

export class WaitingClient {
  private _resolve!: (key: string) => void;
  private _reject!: () => void;

  key: string;
  timeout: number;
  promise: Promise<string>;
  completed: boolean;

  constructor(key: string, timeout: number) {
    this.key = key;
    this.timeout = timeout;
    this.completed = false;

    this.promise = new Promise<string>((resolve, reject) => {
      this._resolve = resolve;
      this._reject = reject;
    });

    if (timeout !== Infinity) {
      setTimeout(() => {
        if (!this.completed) this.reject();
      }, this.timeout);
    }
  }

  static dequeue(key: string) {
    const clientsForKey = WAITING_CLIENTS.get(key);

    if (!clientsForKey || clientsForKey.length === 0) return;

    return clientsForKey.shift();
  }

  queue() {
    const clientsForKey = WAITING_CLIENTS.get(this.key) || [];
    clientsForKey.push(this);
    WAITING_CLIENTS.set(this.key, clientsForKey);
  }

  resolve(key: string) {
    this.completed = true;
    this._resolve?.(key);
  }

  reject() {
    this.completed = true;
    this._reject?.();
  }
}
