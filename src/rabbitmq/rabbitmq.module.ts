import { Module, Global, forwardRef } from '@nestjs/common';
import { RabbitMQService } from './rabbitmq.service';
import { RabbitMQConsumerService } from './rabbitmq-consumer.service';
import { AppointmentService } from 'src/appointment/appointment.service';
import { AppointmentModule } from 'src/appointment/appointment.module';

@Global()
@Module({
  imports: [forwardRef(() => AppointmentModule)],
  providers: [RabbitMQService, RabbitMQConsumerService],
  exports: [RabbitMQService],
})
export class RabbitMQModule {}
