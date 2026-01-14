import { Test, TestingModule } from '@nestjs/testing';
import { NotFoundException, InternalServerErrorException } from '@nestjs/common';
import { AvisosService } from './avisos.service';
import { prisma } from '@smart-condo/database';
import { TipoAviso } from './dto/create-aviso.dto';

// Mock do Prisma
jest.mock('@smart-condo/database', () => ({
  prisma: {
    aviso: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
  },
}));

describe('AvisosService', () => {
  let service: AvisosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvisosService],
    }).compile();

    service = module.get<AvisosService>(AvisosService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    it('deve criar um aviso corretamente', async () => {
      const createDto = {
        titulo: 'Elevador Quebrado',
        descricao: 'Manutenção dia 20',
        tipo: TipoAviso.URGENTE,
        dataEvento: '2026-02-20T10:00:00Z', // String ISO vem do Front
      };
      const autorId = 'user-123';
      const condominioId = 'cond-123';

      // Mock do retorno do Banco (O banco retorna datas como Objeto Date e Enums como String)
      const mockDbResult = {
        id: 'aviso-1',
        titulo: createDto.titulo,
        descricao: createDto.descricao,
        tipo: 'URGENTE', // Banco devolve string
        dataEvento: new Date(createDto.dataEvento),
        autorId,
        condominioId,
        criadoEm: new Date(),
      };

      (prisma.aviso.create as jest.Mock).mockResolvedValue(mockDbResult);

      const result = await service.create(createDto, autorId, condominioId);

      // 1. Verifica se chamou o Prisma com os dados convertidos
      expect(prisma.aviso.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          autorId,
          condominioId,
          tipo: TipoAviso.URGENTE,
          dataEvento: expect.any(Date), // Garante que converteu string para Date
        }),
      }));

      // 2. Verifica se o retorno foi mapeado corretamente (String -> Enum)
      expect(result.tipo).toBe(TipoAviso.URGENTE);
    });

    it('deve usar tipo GERAL se não for informado', async () => {
      const createDto = { titulo: 'Teste', descricao: 'Desc' }; // Sem tipo
      const autorId = 'u1';
      const condId = 'c1';

      (prisma.aviso.create as jest.Mock).mockResolvedValue({ 
        id: '1', 
        tipo: 'GERAL', 
        ...createDto 
      });

      await service.create(createDto as any, autorId, condId);

      expect(prisma.aviso.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          tipo: TipoAviso.GERAL, // Default aplicado
        }),
      }));
    });

    it('deve lançar InternalServerErrorException em caso de erro', async () => {
      (prisma.aviso.create as jest.Mock).mockRejectedValue(new Error('Erro DB'));
      
      await expect(
        service.create({ titulo: 't', descricao: 'd' } as any, 'u1', 'c1')
      ).rejects.toThrow(InternalServerErrorException);
    });
  });

  describe('findAll', () => {
    it('deve retornar todos os avisos', async () => {
      const mockList = [{ id: '1', tipo: 'GERAL' }];
      (prisma.aviso.findMany as jest.Mock).mockResolvedValue(mockList);

      const result = await service.findAll();

      expect(result).toHaveLength(1);
      expect(prisma.aviso.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: {}, // Sem filtro
      }));
    });

    it('deve filtrar por condomínio se ID for fornecido', async () => {
      const mockList = [{ id: '1', tipo: 'GERAL', condominioId: 'cond-1' }];
      (prisma.aviso.findMany as jest.Mock).mockResolvedValue(mockList);

      await service.findAll('cond-1');

      expect(prisma.aviso.findMany).toHaveBeenCalledWith(expect.objectContaining({
        where: { condominioId: 'cond-1' },
      }));
    });
  });

  describe('findOne', () => {
    it('deve retornar um aviso se existir', async () => {
      (prisma.aviso.findUnique as jest.Mock).mockResolvedValue({ id: '1', tipo: 'GERAL' });

      const result = await service.findOne('1');
      expect(result.id).toBe('1');
    });

    it('deve lançar NotFoundException se não existir', async () => {
      (prisma.aviso.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar o aviso', async () => {
      // Setup: Aviso existe
      (prisma.aviso.findUnique as jest.Mock).mockResolvedValue({ id: '1', tipo: 'GERAL' });
      
      const updateData = { titulo: 'Novo Título' };
      (prisma.aviso.update as jest.Mock).mockResolvedValue({ id: '1', ...updateData, tipo: 'GERAL' });

      await service.update('1', updateData);

      expect(prisma.aviso.update).toHaveBeenCalledWith({
        where: { id: '1' },
        data: expect.objectContaining({ titulo: 'Novo Título' }),
      });
    });

    it('deve converter dataEvento string para Date no update', async () => {
      (prisma.aviso.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      (prisma.aviso.update as jest.Mock).mockResolvedValue({ id: '1', tipo: 'GERAL' });

      await service.update('1', { dataEvento: '2026-12-31' });

      expect(prisma.aviso.update).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          dataEvento: expect.any(Date),
        })
      }));
    });
  });

  describe('remove', () => {
    it('deve deletar o aviso', async () => {
      (prisma.aviso.findUnique as jest.Mock).mockResolvedValue({ id: '1' });
      
      await service.remove('1');

      expect(prisma.aviso.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});