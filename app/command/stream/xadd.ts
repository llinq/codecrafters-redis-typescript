import { StreamValue, type StreamId } from "../../memory";
import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "XADD";
const EMPTY = "*-1\r\n";

export class XaddCommand implements Command {
  static _type = TYPE;
  type: string = TYPE;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  validateNewId(key: string, newId: string): StreamId {
    const defaultId: StreamId = {
      millisecondsTime: 0,
      sequenceNumber: 1,
    };

    if (newId === "*") {
      return defaultId;
    }

    const [millisecondsTime, sequenceNumber] = newId.split("-");
    const newMillisecondsTime = Number(millisecondsTime);
    const newSequenceNumber = Number(sequenceNumber);

    if (newMillisecondsTime === 0 && newSequenceNumber === 0) {
      throw `-ERR The ID specified in XADD must be greater than 0-0\r\n`;
    }

    const data = serverStore.get(key);

    if (!data) return defaultId;

    if (data.type !== "stream") throw "The key specified is not an stream";

    const lastKey = Array.from(data.value.keys()).pop();

    if (
      lastKey?.millisecondsTime &&
      lastKey.millisecondsTime >= newMillisecondsTime
    ) {
      throw "-ERR The ID specified in XADD is equal or smaller than the target stream top item\r\n";
    }

    if (
      lastKey?.sequenceNumber &&
      lastKey.sequenceNumber >= newSequenceNumber
    ) {
      throw "-ERR The ID specified in XADD is equal or smaller than the target stream top item\r\n";
    }

    return {
      millisecondsTime: newMillisecondsTime,
      sequenceNumber: newSequenceNumber,
    };
  }

  run(): string {
    try {
      if (this.args.length < 4) throw "XADD command is invalid";

      const key = this.args.shift() ?? "";
      const id = this.args.shift() ?? "";

      const newId = this.validateNewId(key, id);
      const newValue: Map<string, string> = new Map();

      for (let index = 0; index < this.args.length; index += 2) {
        if (!this.args[index + 1]) throw "XADD command is invalid";

        const itemKey = this.args[index];
        const itemValue = this.args[index + 1];

        newValue.set(itemKey, itemValue);
      }

      const existingData = serverStore.get(key);

      const value =
        existingData?.value instanceof Map
          ? existingData.value
          : new StreamValue();

      value.set(newId, newValue);

      serverStore.set({
        key,
        data: {
          type: "stream",
          value: value,
        },
      });

      return `$${id.length}\r\n${id}\r\n`;
    } catch (error: unknown) {
      if (typeof error === "string") {
        return error;
      }
      if (error instanceof Error) {
        return error.message;
      }
      return "An unknown error occurred";
    }
  }
}
