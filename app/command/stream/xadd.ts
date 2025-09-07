import { StreamValue, type MemoryStateData, type StreamId } from "../../memory";
import { RedisProtocolResponse } from "../../redis-protocol/redis-protocol-response";
import { serverStore } from "../../store";
import type { Command } from "../command";

const TYPE = "XADD";
// const EMPTY = "*-1\r\n";

export class XaddCommand implements Command {
  static _type = TYPE;
  type: string = TYPE;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  getDataValue(key: string): StreamValue | undefined {
    const data = serverStore.get(key);

    if (data && data.type !== "stream")
      throw "The key specified is not an stream";

    return data?.value;
  }

  validateNewId(key: string, newId: string): StreamId {
    if (newId === "*") {
      const newMillisecondsTime: number = new Date().getTime();
      let newSequenceNumber: number = 0;

      const data = this.getDataValue(key);

      const existingKeys = Array.from(data ? data.keys() : []);

      const lastKey = existingKeys
        .filter((key) => key.millisecondsTime === newMillisecondsTime)
        .pop();

      if (lastKey) {
        newSequenceNumber = lastKey.sequenceNumber + 1;
      }

      return {
        millisecondsTime: newMillisecondsTime,
        sequenceNumber: newSequenceNumber,
      };
    }

    const [millisecondsTime, sequenceNumber] = newId.split("-");
    const newMillisecondsTime = Number(millisecondsTime);
    let newSequenceNumber = Number(sequenceNumber);

    if (newMillisecondsTime === 0 && newSequenceNumber === 0) {
      throw `ERR The ID specified in XADD must be greater than 0-0\r\n`;
    }

    const data = this.getDataValue(key);

    const existingKeys = Array.from(data ? data.keys() : []);

    if (
      existingKeys.some(
        (existingKey) =>
          existingKey.millisecondsTime > newMillisecondsTime ||
          existingKey.sequenceNumber >= newSequenceNumber
      )
    ) {
      throw "ERR The ID specified in XADD is equal or smaller than the target stream top item\r\n";
    }

    const lastKey = existingKeys
      .filter((key) => key.millisecondsTime === newMillisecondsTime)
      .pop();

    if (sequenceNumber === "*") {
      if (lastKey?.sequenceNumber !== undefined) {
        newSequenceNumber = lastKey.sequenceNumber + 1;
      } else if (newMillisecondsTime === 0) {
        newSequenceNumber = 1;
      } else {
        newSequenceNumber = 0;
      }
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

      const respBulkString = `${newId.millisecondsTime}-${newId.sequenceNumber}`;

      return `$${respBulkString.length}\r\n${respBulkString}\r\n`;
    } catch (error: unknown) {
      if (typeof error === "string") {
        return RedisProtocolResponse.simpleError(error);
      }
      if (error instanceof Error) {
        return RedisProtocolResponse.simpleError(error.message);
      }
      return RedisProtocolResponse.simpleError("An unknown error occurred");
    }
  }
}
