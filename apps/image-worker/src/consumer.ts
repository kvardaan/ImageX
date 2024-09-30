import amqp from "amqplib";

import { config } from "./lib/config";

(async () => {
  const connection = await amqp.connect(String(config.amqpHost));
  const channel = await connection.createChannel();

  // Declare the exchange
  await channel.assertExchange(config.exchanegName, "direct", {
    durable: true,
  });

  // Publish the message
  await channel.publish(config.exchanegName, "", Buffer.from("Hello, world!"), {
    persistent: true,
  });

  console.log(" [x] Sent 'Hello World!'");

  setTimeout(() => {
    connection.close();
  }, 500);
})();
