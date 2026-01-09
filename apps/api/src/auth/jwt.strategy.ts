import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
    constructor(configService: ConfigService) {
        super({
            jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // O token vem no Header "Authorization: Bearer XXXXX"
            ignoreExpiration: false, // Se expirou, barra na hora
            secretOrKey: configService.get<string>('JWT_SECRET') || 'MINHA_CHAVE_SECRETA_MUITO_FORTE', // Tem que ser a mesma chave do login
        });
    }

    // Se o token for válido, o NestJS roda essa função e coloca o retorno dentro de "request.user"
    async validate(payload: any) {
        return {
            userId: payload.sub,
            email: payload.email,
            nome: payload.nome,
            tipo: payload.tipo,
            condominioId: payload.condominioId
        };
    }
}