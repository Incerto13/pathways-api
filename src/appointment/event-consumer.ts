import * as amqp from 'amqplib';
import * as fs from 'fs';
import * as csv from 'csv-parser';
import { Appointment } from './appointment.schema';
import { AppointmentService } from './appointment.service';
import { ConfigService } from '@nestjs/config';

export async function consumeCSVProcessingEvents(
    appointmentService: AppointmentService,
    configservice: ConfigService
): Promise<void> {

  const rabbitmqUri = configservice.get<string>('RABBITMQ_URI');
  if (!rabbitmqUri) {
    throw new Error('RabbitMQ URI is not defined in the environment variables');
  }

  const connection = await amqp.connect(rabbitmqUri);
  const channel = await connection.createChannel();
  const queue = 'appointments';

  await channel.assertQueue(queue);

  channel.consume(queue, async (msg) => {
    if (msg) {
      const filepath = msg.content.toString();
      console.log(`Processing file: ${filepath}`);

      const appointments: Appointment[] = [];
      fs.createReadStream(filepath)
        .on('error', (err) => {
            console.error(`Error reading file: ${err.message}`);
        })
        .pipe(csv())
        .on('data', (row) => {
            console.log('Processing row:', row);
            appointments.push(row); 
        })
        .on('end', async () => {
          await appointmentService.saveAppointments(appointments);
          channel.ack(msg);
        });
    }
  });
}
