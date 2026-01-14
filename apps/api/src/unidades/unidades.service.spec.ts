import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UnidadesService } from './unidades.service';
import { prisma } from '@smart-condo/database';

jest.mock('@smart-condo/database', () => ({
  prisma: {
    unidade: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    condominio: {
      findUnique: jest.fn(),
    },
  },
}));

describe('UnidadesService', () => {
  let service: UnidadesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnidadesService],
    }).compile();

    service = module.get<UnidadesService>(UnidadesService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    const createDto = {
      identificacao: '101',
      bloco: 'A',
      condominioId: 'cond-1',
    };

    it('deve criar unidade mapeando "identificacao" para "numero"', async () => {
      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue({ id: 'cond-1' });

      const mockDbResult = {
        id: 'u1',
        numero: '101', 
        bloco: 'A',
        condominioId: 'cond-1',
        criadoEm: new Date(),
      };
      (prisma.unidade.create as jest.Mock).mockResolvedValue(mockDbResult);

      const result = await service.create(createDto);

      expect(prisma.unidade.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          numero: '101', 
        })
      }));

      expect(result.identificacao).toBe('101');
    });

    it('deve lançar NotFoundException se condomínio não existir', async () => {
      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ConflictException se unidade duplicada', async () => {
      (prisma.condominio.findUnique as jest.Mock).mockResolvedValue({ id: 'cond-1' });
      (prisma.unidade.create as jest.Mock).mockRejectedValue({ code: 'P2002' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('deve retornar lista mapeada', async () => {
      const mockDbList = [{ id: '1', numero: '202', bloco: 'B' }];
      (prisma.unidade.findMany as jest.Mock).mockResolvedValue(mockDbList);

      const result = await service.findAll();

      expect(result[0].identificacao).toBe('202');
      expect(result[0]).not.toHaveProperty('numero');
    });
  });

  describe('update', () => {
    it('deve atualizar mapeando campos', async () => {
      (prisma.unidade.findUnique as jest.Mock).mockResolvedValue({ id: '1', numero: '100' });
      
      (prisma.unidade.update as jest.Mock).mockResolvedValue({ id: '1', numero: '101', bloco: 'B' });

      const result = await service.update('1', { identificacao: '101' });

      expect(prisma.unidade.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({ numero: '101' })
      }));
      
      expect(result.identificacao).toBe('101');
    });
  });
});