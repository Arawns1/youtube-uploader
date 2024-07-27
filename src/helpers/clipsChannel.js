
import { connect } from 'amqplib'
import { AMQP_SERVER, REQUEST_QUEUE_NAME } from '../config/constants.js'
export async function createClipsChannel(onMessage) {
  try {
    const connection = await connect(AMQP_SERVER);
    const channel = await connection.createChannel();

    process.once("SIGINT", async () => {
      await channel.close();
      await connection.close();
    });

    await channel.assertQueue(REQUEST_QUEUE_NAME, { durable: false });
    await channel.consume(
      REQUEST_QUEUE_NAME,
      (message) => {
        if (message) {
          const content = JSON.parse(message.content.toString());
          console.log(" [x] Mensagem recebida");
          onMessage(content, message.properties);
        }
      },
      { noAck: true }
    );

    console.log(" [*] Waiting for messages. To exit press CTRL+C");

    return channel;
  } catch (error) {
    console.error('Error while trying to connect to RabbitMQ', error);
    throw error;
  }
}