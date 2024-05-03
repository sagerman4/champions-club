import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UseFilters } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  await app.listen(3000);
}
bootstrap();
