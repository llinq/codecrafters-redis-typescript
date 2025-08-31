import { serve } from "bun";
import { serverStore } from "./store";

export enum CommandType {
  PING = "PING",
  ECHO = "ECHO",
  SET = "SET",
  GET = "GET",
}

export class Command {
  commandType: CommandType;
  params?: string[];

  constructor(commandType: CommandType, params?: string[]) {
    this.commandType = commandType;
    this.params = params;
  }

  runCommand(): string {
    switch (this.commandType) {
      case CommandType.ECHO:
        if (!this.params || this.params.length !== 1)
          throw "ECHO is mailformed";
        return `$${this.params[0].length}\r\n${this.params[0]}\r\n`;
      case CommandType.PING:
        return `+PONG\r\n`;
      case CommandType.SET:
        if (!this.params || this.params.length !== 2) throw "SET is mailformed";
        serverStore.set(this.params[0], this.params[1]);
        return "+OK\r\n";
      case CommandType.GET:
        if (!this.params || this.params.length !== 1) throw "GET is mailformed";
        const storedValue = serverStore.get(this.params[0]);
        return storedValue ? `$${storedValue.length}\r\n${storedValue}\r\n` : '$-1\r\n';
      default:
        return "";
    }
  }
}
