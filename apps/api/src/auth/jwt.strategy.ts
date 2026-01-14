import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

export interface JwtPayload {
  sub: string;
  email: string;
  nome: string;
  tipo: string;
  condominioId?: string;
}

export interface UserFromJwt {
  id: string;
  email: string;
  name: string; 
  role: string; 
  condominioId?: string;
}

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(configService: ConfigService) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('JWT_SECRET') || 'MINHA_CHAVE_SECRETA_MUITO_FORTE',
    });
  }

  async validate(payload: JwtPayload): Promise<UserFromJwt> {
    return {
      id: payload.sub,          
      email: payload.email,
      name: payload.nome,       
      role: payload.tipo,       
      condominioId: payload.condominioId
    };
  }
}