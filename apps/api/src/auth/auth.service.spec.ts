import { Test, TestingModule } from '@nestjs/testing';
import { UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { prisma } from '@smart-condo/database';
import * as bcrypt from 'bcrypt';

jest.mock('@smart-condo/database', () => ({
  prisma: {
    user: {
      findUnique: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;

  const mockJwtService = {
    signAsync: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    jest.clearAllMocks();
  });

  describe('login', () => {
    it('deve retornar token e usuário se credenciais forem válidas', async () => {
      const loginDto = { email: 'teste@email.com', senha: '123' };
      const mockUser = {
        id: '1',
        email: 'teste@email.com',
        senha: 'hash',
        nome: 'Teste',
        tipo: 'MORADOR',
        condominioId: '123',
        unidadeId: '101',
        criadoEm: new Date(),
      };

      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(true);
      mockJwtService.signAsync.mockResolvedValue('token_jwt_valido');

      const result = await service.login(loginDto);

      expect(result).toEqual({
        accessToken: 'token_jwt_valido',
        user: expect.objectContaining({
          email: 'teste@email.com',
          name: 'Teste', 
        }),
      });
    });

    it('deve lançar UnauthorizedException se senha for inválida', async () => {
      const mockUser = { id: '1', email: 'teste@email.com', senha: 'hash' };
      
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(mockUser);
      (bcrypt.compare as jest.Mock).mockResolvedValue(false); 

      await expect(service.login({ email: 't', senha: 'e' })).rejects.toThrow(UnauthorizedException);
    });

    it('deve lançar UnauthorizedException se usuário não existir', async () => {
      (prisma.user.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.login({ email: 't', senha: 'e' })).rejects.toThrow(UnauthorizedException);
    });
  });
});