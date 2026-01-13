import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { CondominiosService } from './condominios.service';
import { prisma } from '@smart-condo/database';

jest.mock('@smart-condo/database', () => ({
  prisma: {
    condominio: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
      count: jest.fn(),
    },
    user: {
      deleteMany: jest.fn(),
    },
    unidade: {
      deleteMany: jest.fn(),
    },
    aviso: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

describe('CondominiosService', () => {
  let service: CondominiosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CondominiosService],
    }).compile();

    service = module.get<CondominiosService>(CondominiosService);
    jest.clearAllMocks();
  });

  it('deve estar definido', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('deve criar um condomínio com sucesso', async () => {
      const createDto = {
        nome: 'Residencial Teste',
        endereco: 'Rua Teste, 123',
      };

      const mockCondominio = {
        id: '123',
        ...createDto,
        criadoEm: new Date(),
      };

      (prisma.condominio.create as jest.Mock).mockResolvedValue(mockCondominio);

      const result = await service.create(createDto);

      expect(result).toEqual(mockCondominio);
      expect(prisma.condominio.create).toHaveBeenCalledWith({ data: createDto });
    });

    it('deve lançar ConflictException quando houver dado duplicado', async () => {
      const createDto = {
        nome: 'Residencial Teste',
        endereco: 'Rua Teste, 123',
      };

      (prisma.condominio.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('deve lançar InternalServerErrorException para outros erros', async () => {
      const createDto = {
        nome: 'Residencial Teste',
        endereco: 'Rua Teste, 123',
      };

      (prisma.condominio.create as jest.Mock).mockRejectedValue(new Error('Erro desconhecido'));

      await expect(service.create(createDto)).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista paginada de condomínios', async () => {
      const mockCondominios = [
        { id: '1', nome: 'Condomínio 1', endereco: null, criadoEm: new Date() },
        { id: '2', nome: 'Condomínio 2', endereco: null, criadoEm: new Date() },
      ];

      (prisma.condominio.findMany as jest.Mock).mockResolvedValue(mockCondominios);
      (prisma.condominio.count as jest.Mock).mockResolvedValue(2);

      const result = await service.findAll({ page: 1, perPage: 10 });

      expect(result.data).toEqual(mockCondominios);
      expect(result.meta.total).toBe(2);
      expect(result.meta.page).toBe(1);
      expect(result.meta.perPage).toBe(10);
    });

    it('deve filtrar por nome quando search é fornecido', async () => {
      const mockCondominios = [
        { id: '1', nome: 'Residencial Teste', endereco: null, criadoEm: new Date() },
      ];

      (prisma.condominio.findMany as jest.Mock).mockResolvedValue(mockCondominios);
      (prisma.condominio.count as jest.Mock).mockResolvedValue(1);

      const result = await service.findAll({ page: 1, perPage: 10, search: 'Residencial' });

      expect(prisma.condominio.findMany).toHaveBeenCalledWith({
        where: {
          nome: {
            contains: 'Residencial',
            mode: 'insensitive',
          },
        },
        skip: 0,
        take: 10,
        orderBy: {
          criadoEm: 'desc',
        },
      });
    });
  });

  describe('findOne', () => {
    it('deve retornar um condomínio quando encontrado', async () => {
      const mockCondominio = {
        id: '123',
        nome: 'Residencial Teste',
        endereco: null,
        criadoEm: new Date(),
      };

      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(mockCondominio);

      const result = await service.findOne('123');

      expect(result).toEqual(mockCondominio);
      expect(prisma.condominio.findUnique).toHaveBeenCalledWith({ where: { id: '123' } });
    });

    it('deve lançar NotFoundException quando não encontrado', async () => {
      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar um condomínio com sucesso', async () => {
      const mockCondominio = {
        id: '123',
        nome: 'Residencial Teste',
        endereco: null,
        criadoEm: new Date(),
      };

      const updateDto = { nome: 'Residencial Atualizado' };

      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(mockCondominio);
      (prisma.condominio.update as jest.Mock).mockResolvedValue({
        ...mockCondominio,
        ...updateDto,
      });

      const result = await service.update('123', updateDto);

      expect(result.nome).toBe('Residencial Atualizado');
      expect(prisma.condominio.update).toHaveBeenCalledWith({
        where: { id: '123' },
        data: updateDto,
      });
    });

    it('deve lançar NotFoundException quando condomínio não existe', async () => {
      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.update('999', { nome: 'Teste' })).rejects.toThrow(NotFoundException);
    });
  });

  describe('remove', () => {
    it('deve excluir condomínio sem dependências', async () => {
      const mockCondominio = {
        id: '123',
        nome: 'Residencial Teste',
        endereco: null,
        criadoEm: new Date(),
      };

      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(mockCondominio);
      (prisma.condominio.delete as jest.Mock).mockResolvedValue(mockCondominio);

      await service.remove('123', false);

      expect(prisma.condominio.delete).toHaveBeenCalledWith({ where: { id: '123' } });
    });

    it('deve excluir em cascata quando force=true', async () => {
      const mockCondominio = {
        id: '123',
        nome: 'Residencial Teste',
        endereco: null,
        criadoEm: new Date(),
      };

      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(mockCondominio);
      (prisma.$transaction as jest.Mock).mockResolvedValue([{}, {}, {}, mockCondominio]);

      await service.remove('123', true);

      expect(prisma.$transaction).toHaveBeenCalled();
    });

    it('deve lançar ConflictException quando há dependências e force=false', async () => {
      const mockCondominio = {
        id: '123',
        nome: 'Residencial Teste',
        endereco: null,
        criadoEm: new Date(),
      };

      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(mockCondominio);
      (prisma.condominio.delete as jest.Mock).mockRejectedValue({ code: 'P2003' });

      await expect(service.remove('123', false)).rejects.toThrow(ConflictException);
    });
  });
});