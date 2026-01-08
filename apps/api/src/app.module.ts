import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config'; // <--- Importante
import { AppController } from './app.controller';
import { AppService } from './app.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), // <--- Carrega o .env
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}