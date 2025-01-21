import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';


async function bootstrap() {
  const logger = new Logger();
  const port = 3000;

  console.log('MongoDB connected successfully');

  const app = await NestFactory.create(AppModule);
  app.setGlobalPrefix('api');

  // Set up Swagger
  const config = new DocumentBuilder()
  .setTitle('Pathways REST API')
  .setDescription('API for managing patients and appointments')
  .setVersion('1.0')
  .addTag('patients')
  .addTag('appointments')
  .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  await app.listen(port);
  logger.log(`Application listening on port ${port}`)
}
bootstrap().catch((error) => {
  console.error('Error during initialization:', error);
});