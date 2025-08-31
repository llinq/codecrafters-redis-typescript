import * as net from "net";
import { RedisProtocol } from "./redis-protocol";

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", (data) => {
    console.log("[server] received: " + data);

    const redisProtocol = new RedisProtocol(data.toString());
    const command = redisProtocol.deserialize();

    console.log("[server] command", command.commandType, command.params);

    const commandToWrite = command.runCommand();
    console.log("[server] command to write:", commandToWrite);
    if (commandToWrite) {
      connection.write(commandToWrite);
    }
  });
});

server.listen(6379, "127.0.0.1");
