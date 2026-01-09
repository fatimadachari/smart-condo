import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CondominiosModule } from './condominios/condominios.module'; 
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { UnidadesModule } from './unidades/unidades.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    CondominiosModule,
    UsersModule,
    AuthModule, 
    UnidadesModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}