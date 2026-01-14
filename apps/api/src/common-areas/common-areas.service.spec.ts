import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, InternalServerErrorException } from '@nestjs/common';
import { CommonAreasService } from './common-areas.service';
import { prisma } from '@smart-condo/database';

jest.mock('@smart-condo/database', () => ({
  prisma: {
    commonArea: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      update: jest.fn(),
      delete: jest.fn(),
    },
    booking: {
      deleteMany: jest.fn(),
    },
    $transaction: jest.fn(),
  },
}));

const mockPrismaError = (code: string) => {
  const error = new Error('Prisma Client Error');
  (error as any).code = code;
  return error;
};

describe('CommonAreasService', () => {
  let service: CommonAreasService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CommonAreasService],
    }).compile();

    service = module.get<CommonAreasService>(CommonAreasService);
    
    // CORREÇÃO ESSENCIAL: resetAllMocks remove as implementações (mockResolvedValue/RejectedValue)
    // impedindo que o erro configurado em um teste quebre o próximo.
    jest.resetAllMocks(); 
  });

  describe('create', () => {
    it('deve criar uma área comum', async () => {
      const dto = { name: 'Salão' };
      (prisma.commonArea.create as jest.Mock).mockResolvedValue({ id: '1', ...dto });

      const result = await service.create(dto);
      expect(result).toEqual(expect.objectContaining({ id: '1', name: 'Salão' }));
    });

    it('deve lançar ConflictException se nome duplicado', async () => {
      (prisma.commonArea.create as jest.Mock).mockRejectedValue(mockPrismaError('P2002'));
      
      await expect(service.create({ name: 'Salão' }))
        .rejects
        .toThrow(ConflictException);
    });
  });

  describe('remove', () => {
    const mockArea = { id: 'area-1', name: 'Salão' };

    it('deve remover normalmente se force=false e sem dependências', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue(mockArea);
      (prisma.commonArea.delete as jest.Mock).mockResolvedValue(mockArea);

      await service.remove('area-1', false);

      expect(prisma.commonArea.delete).toHaveBeenCalledWith({ where: { id: 'area-1' } });
    });

    it('deve lançar ConflictException se houver reservas e force=false', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue(mockArea);
      (prisma.commonArea.delete as jest.Mock).mockRejectedValue(mockPrismaError('P2003'));

      await expect(service.remove('area-1', false))
        .rejects
        .toThrow(ConflictException);
    });

    it('deve usar transaction para excluir em cascata se force=true', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue(mockArea);
      
      // Garante que delete e deleteMany resolvam com sucesso (limpando qualquer erro residual)
      (prisma.commonArea.delete as jest.Mock).mockResolvedValue(mockArea);
      (prisma.booking.deleteMany as jest.Mock).mockResolvedValue({ count: 5 });

      (prisma.$transaction as jest.Mock).mockResolvedValue([
        { count: 5 }, 
        mockArea      
      ]);

      await service.remove('area-1', true);

      expect(prisma.$transaction).toHaveBeenCalled();
      expect(prisma.booking.deleteMany).toHaveBeenCalledWith({ where: { commonAreaId: 'area-1' } });
      expect(prisma.commonArea.delete).toHaveBeenCalledWith({ where: { id: 'area-1' } });
    });
  });
});