import { Injectable, OnModuleInit } from '@nestjs/common';
import { AppointmentService } from '../appointment/appointment.service';
import { consumeCSVProcessingEvents } from '../appointment/event-consumer';

@Injectable()
export class RabbitMQConsumerService implements OnModuleInit {
  constructor(private readonly appointmentService: AppointmentService) {}

  async onModuleInit() {
    console.log('Starting RabbitMQ Consumer...');
    await consumeCSVProcessingEvents(this.appointmentService);
  }
}
