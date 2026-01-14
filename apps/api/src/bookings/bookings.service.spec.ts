import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { prisma } from '@smart-condo/database';
import { BookingStatus } from './dto/update-booking.dto';

// 1. Mock do Prisma (Database)
jest.mock('@smart-condo/database', () => ({
  prisma: {
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(), // Crucial para verificação de conflitos
      update: jest.fn(),
      delete: jest.fn(),
    },
    commonArea: {
      findUnique: jest.fn(),
    },
  },
}));

describe('BookingsService', () => {
  let service: BookingsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BookingsService],
    }).compile();

    service = module.get<BookingsService>(BookingsService);
    jest.clearAllMocks();
  });

  describe('create', () => {
    // Dados padrão para os testes de criação
    const createDto = {
      commonAreaId: 'area-123',
      userId: 'user-123',
      date: new Date('2026-02-20T14:00:00Z'),
      endDate: new Date('2026-02-20T16:00:00Z'), // 2 horas de duração
    };

    it('deve criar uma reserva com sucesso se não houver conflitos', async () => {
      // Mock: Área comum existe e está ativa
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area-123', isActive: true });
      
      // Mock: NENHUM conflito encontrado (retorna null)
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue(null);

      // Mock: Criação no banco
      const mockCreatedBooking = {
        id: 'booking-1',
        ...createDto,
        status: 'PENDING', // O Banco retorna string
        createdAt: new Date(),
      };
      (prisma.booking.create as jest.Mock).mockResolvedValue(mockCreatedBooking);

      const result = await service.create(createDto);

      expect(result).toEqual(expect.objectContaining({
        id: 'booking-1',
        status: BookingStatus.PENDING, // Verifica se o mapToDto converteu corretamente
      }));
      expect(prisma.booking.create).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se a data final for anterior à inicial', async () => {
      const invalidDto = {
        ...createDto,
        endDate: new Date('2026-02-20T13:00:00Z'), // 13h (antes das 14h)
      };

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se a área comum não existir', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ConflictException se houver choque de horário', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area-123', isActive: true });
      
      // Mock: ENCONTROU uma reserva conflitante
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue({ id: 'reserva-conflitante-id' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('deve calcular endDate automaticamente (+1h) se não for fornecido', async () => {
      const dtoSemFim = {
        commonAreaId: 'area-123',
        userId: 'user-123',
        date: new Date('2026-02-20T14:00:00Z'),
        // endDate indefinido
      };

      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area-123', isActive: true });
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.booking.create as jest.Mock).mockResolvedValue({ ...dtoSemFim, status: 'PENDING' });

      await service.create(dtoSemFim);

      // Verifica com quais argumentos o prisma.create foi chamado
      expect(prisma.booking.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
          // O endDate deve ter sido gerado automaticamente para 15:00 (+1h)
          endDate: new Date('2026-02-20T15:00:00Z'),
        }),
      }));
    });
  });

  describe('findAll', () => {
    it('deve retornar lista de reservas', async () => {
      const mockBookings = [
        { id: '1', status: 'CONFIRMED', date: new Date() },
        { id: '2', status: 'PENDING', date: new Date() },
      ];
      (prisma.booking.findMany as jest.Mock).mockResolvedValue(mockBookings);

      const result = await service.findAll();

      expect(result).toHaveLength(2);
      expect(result[0].status).toBe(BookingStatus.CONFIRMED);
    });
  });

  describe('findOne', () => {
    it('deve retornar uma reserva específica', async () => {
      const mockBooking = { id: '1', status: 'PENDING' };
      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(mockBooking);

      const result = await service.findOne('1');
      expect(result).toEqual(mockBooking);
    });

    it('deve lançar NotFoundException se não encontrar', async () => {
      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(null);
      await expect(service.findOne('999')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('deve atualizar o status de uma reserva', async () => {
      const existing = { id: '1', status: 'PENDING' };
      const updated = { id: '1', status: 'CONFIRMED' };

      // O update chama o findOne primeiro para garantir existência
      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(existing);
      (prisma.booking.update as jest.Mock).mockResolvedValue(updated);

      const result = await service.update('1', { status: BookingStatus.CONFIRMED });

      expect(result.status).toBe(BookingStatus.CONFIRMED);
    });
  });

  describe('remove', () => {
    it('deve remover uma reserva', async () => {
      const existing = { id: '1' };
      (prisma.booking.findUnique as jest.Mock).mockResolvedValue(existing);
      
      await service.remove('1');

      expect(prisma.booking.delete).toHaveBeenCalledWith({ where: { id: '1' } });
    });
  });
});