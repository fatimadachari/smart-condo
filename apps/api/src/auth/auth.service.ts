import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '@smart-condo/database'; // Vamos buscar direto ou via service

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService, // Injetamos o serviço de usuários
    private jwtService: JwtService // Injetamos o gerador de token
  ) {}

  async login(email: string, senha: string) {
    // 1. Buscar o usuário no banco (precisamos buscar 'na mão' aqui para pegar a senha, 
    // pois o findAll/findOne do UsersService esconde a senha por segurança)
    const user = await prisma.user.findUnique({ where: { email } });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 2. Comparar a senha enviada com o Hash do banco
    const isPasswordValid = await bcrypt.compare(senha, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    // 3. Gerar o Token (Payload são os dados que vão dentro do token)
    const payload = { sub: user.id, email: user.email, nome: user.nome, tipo: user.tipo, condominioId: user.condominioId };
    
    return {
      access_token: await this.jwtService.signAsync(payload),
      user: { // Devolvemos dados básicos pro front já saber quem logou
        nome: user.nome,
        email: user.email,
        tipo: user.tipo
      }
    };
  }
}