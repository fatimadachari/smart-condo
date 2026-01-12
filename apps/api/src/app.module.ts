import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CondominiosModule } from './condominios/condominios.module'; 
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UnidadesModule } from './unidades/unidades.module';
import { AvisosModule } from './avisos/avisos.module';
import { CommonAreasModule } from './common-areas/common-areas.module';
import { BookingsModule } from './bookings/bookings.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CondominiosModule,
    UsersModule,
    AuthModule, 
    UnidadesModule, 
    AvisosModule,
    CommonAreasModule,
    BookingsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}