import * as net from "net";
import { RedisProtocol } from "./redis-protocol/redis-protocol";
import "./command/registry";
import { WaitingClient } from "./waiting-client";

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", async (data) => {
    const redisProtocol = new RedisProtocol(data.toString());
    const command = redisProtocol.deserialize();
    const commandToWrite = await command.run();
    if (commandToWrite) {
      connection.write(commandToWrite);
    }
  });

  connection.on("close", () => {
    WaitingClient.clearAll();
  });
});

server.listen(6379, "127.0.0.1");
