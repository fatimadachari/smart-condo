import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

// 1. Interface para definir o que esperamos receber DENTRO do token
export interface JwtPayload {
  sub: string;
  email: string;
  nome: string;
  tipo: string;
  condominioId?: string;
}

// 2. Interface para definir o que estará disponível em 'req.user' nos Controllers
export interface UserFromJwt {
  id: string;
  email: string;
  name: string; // Padronizamos para inglês aqui
  role: string; // Padronizamos para inglês aqui
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
    // O retorno deste método é o que o Nest injeta em `req.user`
    return {
      id: payload.sub,          // Mapeamos 'sub' para 'id' (mais fácil de usar)
      email: payload.email,
      name: payload.nome,       // Traduzimos 'nome' (banco) para 'name' (padrão projeto)
      role: payload.tipo,       // Traduzimos 'tipo' (banco) para 'role' (padrão projeto)
      condominioId: payload.condominioId
    };
  }
}