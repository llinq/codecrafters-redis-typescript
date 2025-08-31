import type { Command } from "../command";

const type = 'ECHO';

export class EchoCommand implements Command {
  static _type: string = type;
  type: string = type;
  args: string[];

  constructor(args: string[]) {
    this.args = args;
  }

  run(): string {
    if (this.args.length !== 1) throw "ECHO command is invalid";
    const msg = this.args[0];
    return `$${msg.length}\r\n${msg}\r\n`;
  }
}
