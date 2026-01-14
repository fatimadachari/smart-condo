import { Injectable, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { prisma } from '@smart-condo/database';
import { LoginDto } from './dto/login.dto';
import { LoginResponseDto } from './dto/login-response.dto';

@Injectable()
export class AuthService {
  constructor(private jwtService: JwtService) {}

  async login(loginDto: LoginDto): Promise<LoginResponseDto> {
    const user = await prisma.user.findUnique({ 
        where: { email: loginDto.email } 
    });

    if (!user) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const isPasswordValid = await bcrypt.compare(loginDto.senha, user.senha);

    if (!isPasswordValid) {
      throw new UnauthorizedException('E-mail ou senha incorretos.');
    }

    const payload = { 
        sub: user.id, 
        email: user.email, 
        nome: user.nome, 
        tipo: user.tipo, 
        condominioId: user.condominioId 
    };
    
    const accessToken = await this.jwtService.signAsync(payload);

    return {
      accessToken,
      user: {
          id: user.id,
          name: user.nome,
          email: user.email,
          role: user.tipo as any, 
          condominioId: user.condominioId,
          unidadeId: user.unidadeId,
          criadoEm: user.criadoEm
      }
    };
  }
}