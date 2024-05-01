import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [AuthModule, 
    HttpModule, ConfigModule.forRoot({
    isGlobal: true,  // This makes ConfigModule globally available across your app
  }),],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
