import * as amqp from 'amqplib';
import { ConfigService } from '@nestjs/config';

export async function sendCSVProcessingEvent(
    filepath: string,
    configservice: ConfigService,
): Promise<void> {

  const rabbitmqUri = configservice.get<string>('RABBITMQ_URI');
  if (!rabbitmqUri) {
    throw new Error('RabbitMQ URI is not defined in the environment variables');
  }

  const connection = await amqp.connect(rabbitmqUri);
  const channel = await connection.createChannel();
  const queue = 'appointments';

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(filepath));
  console.log(`Filepath ${filepath} sent to queue.`);
  await channel.close();
  await connection.close();
}
