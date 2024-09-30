import { config as conf } from "dotenv";

conf();

const _config = {
  amqpHost: process.env.AMQP_HOST || "amqp://localhost",
  exchanegName: "image_exchange",
  queueName: "images_to_be_processed",
  deadLetteQueueName: "images_dead_letter",
};

export const config = Object.freeze(_config);