import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CondominiosModule } from './condominios/condominios.module'; 

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CondominiosModule, // <--- Adicione aqui
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}