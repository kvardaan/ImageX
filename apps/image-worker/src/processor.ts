import amqp from "amqplib";

import { config } from "./lib/config";

(async () => {
  const connection = await amqp.connect(String(config.amqpHost));
  const channel = await connection.createChannel();

  // Declare the exchange
  await channel.assertExchange(config.exchanegName, "direct", {
    durable: true,
  });

  // Declare the queue
  await channel.assertQueue(config.queueName, {
    durable: true,
  });

  // Bind the queue to the exchange
  await channel.bindQueue(config.queueName, config.exchanegName, "", "", true);

  // Declare the dead letter queue
  await channel.assertQueue(config.deadLetteQueueName, {
    durable: true,
  });

  // Create a consumer
  await channel.consume(
    config.queueName,
    (message) => {
      if (message !== null) {
        console.log(message.content.toString());
        channel.ack(message);
      }
    },
    {
      noAck: false,
    }
  );

  // Set up a dead letter queue
  await channel.assertQueue(config.deadLetteQueueName, {
    durable: true,
    arguments: {
      "x-dead-letter-exchange": config.exchanegName,
      "x-dead-letter-routing-key": config.queueName,
    },
  });

  console.log(" [*] Waiting for messages. To exit press CTRL+C");
})();