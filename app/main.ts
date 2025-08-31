import * as net from "net";
import { RedisProtocol } from "./redis-protocol";

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", (data) => {
    console.log("[server] received: " + data);

    const redisProtocol = new RedisProtocol(data.toString());
    const commands = redisProtocol.deserialize();

    console.log(
      "[server] commands",
      commands.map((command) => command.command)
    );

    commands.forEach((command, index) => {
      const commandToWrite = command.runCommand(commands[index + 1]);
      console.log("command to write:", commandToWrite);
      if (commandToWrite) {
        connection.write(commandToWrite);
      }
    });
  });
});

server.listen(6379, "127.0.0.1");
