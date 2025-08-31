import * as net from "net";

const client = net.createConnection(6379, "127.0.0.1", () => {
  client.write("*2\r\n$4\r\nECHO\r\n$3\r\nhey\r\n");

  client.on('data', (data) => {
    console.log('[client] received: ' + data);
  })
});
