import * as net from "net";

const client = net.createConnection(6379, "127.0.0.1", () => {
  client.write("PING\nPING");

  client.on('data', (data) => {
    console.log('[client] received: ' + data);
  })
});
