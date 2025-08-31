import { Command, CommandType } from "./command";

export class RedisProtocol {
  data: string;

  constructor(data: string) {
    this.data = data;
  }

  deserialize(): Command[] {
    const commandsSize = +(this.data.match(/^\*(.*)/)?.[1] ?? 1);
    const commands: Command[] = [];

    for (let index = 0; index < commandsSize; index++) {
      let text = this.data.split("$")[index];

      const commandLength = text.match(/(\d+)\r\n/)?.[1] ?? 0;
      const commandType = text.match(`\r\n(.{${commandLength}})\r\n`)?.[1] ?? "";

      text = text.split(commandType)?.[1] ?? text;



      const commandParams = text.matchAll(/\r\n$/);

      console.log('[server] command type: ' + commandType);
      console.log('[server] command params: ' + commandParams);

      commands.push(new Command(commandType.toUpperCase() as CommandType));
    }

    return commands;
  }
}
