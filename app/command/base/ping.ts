import type { Command } from "../command";

const type = 'PING';

export class PingCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    return "+PONG\r\n";
  }
}
