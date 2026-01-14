import { Test, TestingModule } from '@nestjs/testing';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { BookingsService } from './bookings.service';
import { prisma } from '@smart-condo/database';

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
      commonAreaId: 'area1',
      userId: 'user1',
      date: new Date('2026-02-01T10:00:00Z'),
      endDate: new Date('2026-02-01T11:00:00Z'),
    };

    it('deve criar reserva se não houver conflito', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area1', isActive: true });
      
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue(null);

      const mockBooking = { ...createDto, id: '1', status: 'PENDING', createdAt: new Date() };
      (prisma.booking.create as jest.Mock).mockResolvedValue(mockBooking);

      const result = await service.create(createDto);
      expect(result).toEqual(mockBooking);
    });

    it('deve lançar ConflictException se houver choque de horário', async () => {
      (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue({ id: 'area1', isActive: true });
      
      (prisma.booking.findFirst as jest.Mock).mockResolvedValue({ id: 'reserva_existente' });

      await expect(service.create(createDto)).rejects.toThrow(ConflictException);
    });
    
    it('deve lançar NotFoundException se área comum não existir', async () => {
       (prisma.commonArea.findUnique as jest.Mock).mockResolvedValue(null);
       await expect(service.create(createDto)).rejects.toThrow(NotFoundException);
    });
  });
});