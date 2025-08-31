import * as net from "net";

const server: net.Server = net.createServer((connection: net.Socket) => {
  connection.on("data", (data) => {
    console.log("[server] received: " + data);

    const commands = data.toString().split("\n");

    commands.forEach((command) => {
      console.log("[server] processing command " + command);
      connection.write("+PONG\r\n");
    });
  });
});

server.listen(6379, "127.0.0.1");
