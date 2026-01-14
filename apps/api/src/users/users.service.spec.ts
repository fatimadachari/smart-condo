import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { prisma } from '@smart-condo/database';
import * as bcrypt from 'bcrypt';
import { UserRole } from './dto/create-user.dto';

jest.mock('@smart-condo/database', () => ({
  prisma: {
    user: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}));

describe('UsersService', () => {
  let service: UsersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UsersService],
    }).compile();

    service = module.get<UsersService>(UsersService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar usuário com senha hash e retornar DTO mapeado', async () => {
      const createDto = {
        name: 'Ana',
        email: 'ana@teste.com',
        password: '123',
        role: UserRole.MORADOR,
        condominioId: 'cond1',
      };

      (bcrypt.hash as jest.Mock).mockResolvedValue('hash_senha');
      
      // O Prisma retorna nomes em PT (banco)
      const mockUserDb = {
        id: '1',
        nome: 'Ana',
        email: 'ana@teste.com',
        senha: 'hash_senha',
        tipo: 'MORADOR',
        condominioId: 'cond1',
        criadoEm: new Date(),
      };

      (prisma.user.create as jest.Mock).mockResolvedValue(mockUserDb);

      const result = await service.create(createDto);

      expect(prisma.user.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ senha: 'hash_senha', condominioId: 'cond1' }),
      }));

      // Verifica se o retorno seguiu o UserResponseDto (EN)
      expect(result).toEqual(expect.objectContaining({
        name: 'Ana', // Veio de 'nome'
        role: 'MORADOR', // Veio de 'tipo'
      }));
      expect(result).not.toHaveProperty('password'); // Não pode ter senha
    });
  });
});