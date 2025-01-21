import * as amqp from 'amqplib';

export async function sendCSVProcessingEvent(filepath: string): Promise<void> {
  const connection = await amqp.connect('amqp://localhost');
  const channel = await connection.createChannel();
  const queue = 'appointments';

  await channel.assertQueue(queue);
  channel.sendToQueue(queue, Buffer.from(filepath));
  console.log(`Filepath ${filepath} sent to queue.`);
  await channel.close();
  await connection.close();
}
