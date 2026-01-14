import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException, BadRequestException, InternalServerErrorException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { prisma } from '@smart-condo/database';
import { BookingStatus } from './dto/update-booking.dto';

jest.mock('@smart-condo/database', () => ({
  prisma: {
    booking: {
      create: jest.fn(),
      findMany: jest.fn(),
      findUnique: jest.fn(),
      findFirst: jest.fn(), 
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
    const createDto = {
      commonAreaId: 'area-123',
      userId: 'user-123',
      date: new Date('2026-02-20T14:00:00Z'),
      endDate: new Date('2026-02-20T16:00:00Z'), 
    };

    it('deve criar uma reserva com sucesso se não houver conflitos', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area-123', isActive: true });
      
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue(null);

      const mockCreatedBooking = {
        id: 'booking-1',
        ...createDto,
        status: 'PENDING', 
        createdAt: new Date(),
      };
      (prisma.booking.create as jest.Mock).mockResolvedValue(mockCreatedBooking);

      const result = await service.create(createDto);

      expect(result).toEqual(expect.objectContaining({
        id: 'booking-1',
        status: BookingStatus.PENDING, 
      }));
      expect(prisma.booking.create).toHaveBeenCalled();
    });

    it('deve lançar BadRequestException se a data final for anterior à inicial', async () => {
      const invalidDto = {
        ...createDto,
        endDate: new Date('2026-02-20T13:00:00Z'), 
      };

      await expect(service.create(invalidDto)).rejects.toThrow(BadRequestException);
    });

    it('deve lançar NotFoundException se a área comum não existir', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue(null);

      await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });

    it('deve lançar ConflictException se houver choque de horário', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area-123', isActive: true });
      
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue({ id: 'reserva-conflitante-id' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });

    it('deve calcular endDate automaticamente (+1h) se não for fornecido', async () => {
      const dtoSemFim = {
        commonAreaId: 'area-123',
        userId: 'user-123',
        date: new Date('2026-02-20T14:00:00Z'),
      };

      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area-123', isActive: true });
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue(null);
      (prisma.booking.create as jest.Mock).mockResolvedValue({ ...dtoSemFim, status: 'PENDING' });

      await service.create(dtoSemFim);

      expect(prisma.booking.create).toHaveBeenCalledWith(expect.objectContaining({
        data: expect.objectContaining({
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