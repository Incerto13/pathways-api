import { Injectable, OnModuleDestroy } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as amqp from 'amqplib';

@Injectable()
export class RabbitMQService implements OnModuleDestroy {
  private connection: amqp.Connection;
  private channel: amqp.Channel;

  constructor(private readonly configService: ConfigService) {}

  /**
   * Initialize RabbitMQ connection and channel.
   */
  async init(): Promise<void> {
    try {
      const rabbitmqUrl = this.configService.get<string>('app.rabbitmqUrl');
      this.connection = await amqp.connect(rabbitmqUrl);
      this.channel = await this.connection.createChannel();
    } catch (error) {
      console.error('Failed to connect to RabbitMQ:', error);
      throw error;
    }
  }

  /**
   * Publish a message to a specific queue.
   * @param queue - Name of the queue
   * @param message - Message payload
   */
  async sendToQueue(queue: string, message: string): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.sendToQueue(queue, Buffer.from(message));
      console.log(`Message sent to queue ${queue}:`, message);
    } catch (error) {
      console.error(`Failed to send message to queue ${queue}:`, error);
    }
  }

  /**
   * Consume messages from a specific queue.
   * @param queue - Name of the queue
   * @param onMessage - Callback function for processing messages
   */
  async consume(queue: string, onMessage: (msg: amqp.ConsumeMessage) => void): Promise<void> {
    try {
      await this.channel.assertQueue(queue, { durable: true });
      this.channel.consume(queue, (msg) => {
        if (msg) {
          onMessage(msg);
          this.channel.ack(msg);
        }
      });
      console.log(`Consuming messages from queue ${queue}`);
    } catch (error) {
      console.error(`Failed to consume messages from queue ${queue}:`, error);
    }
  }

  /**
   * Cleanup RabbitMQ connection on shutdown.
   */
  async onModuleDestroy(): Promise<void> {
    try {
      if (this.channel) {
        await this.channel.close();
        console.log('RabbitMQ channel closed.');
      }
      if (this.connection) {
        await this.connection.close();
        console.log('RabbitMQ connection closed.');
      }
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}
