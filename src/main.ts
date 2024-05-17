import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UseFilters } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  await app.listen(process.env.PORT || 8080);
}
bootstrap();
