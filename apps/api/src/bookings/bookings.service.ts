import { Injectable, ConflictException, InternalServerErrorException, NotFoundException, BadRequestException } from '@nestjs/common';
import { prisma } from '@smart-condo/database';
import { CreateBookingDto } from './dto/create-booking.dto';
import { UpdateBookingDto, BookingStatus } from './dto/update-booking.dto'; // Enum do DTO
import { BookingResponseDto } from './dto/booking-response.dto';

@Injectable()
export class BookingsService {

  private mapToDto(booking: any): BookingResponseDto {
    return {
      ...booking,
      status: booking.status as BookingStatus, 
    };
  }

  async create(data: CreateBookingDto): Promise<BookingResponseDto> {
    const startDate = new Date(data.date);
    const endDate = data.endDate 
      ? new Date(data.endDate) 
      : new Date(startDate.getTime() + 60 * 60 * 1000); 

    if (endDate <= startDate) {
      throw new BadRequestException('A data de fim deve ser maior que a de início.');
    }

    const commonArea = await prisma.commonArea.findUnique({
      where: { id: data.commonAreaId, isActive: true }
    });

    if (!commonArea) throw new NotFoundException('Área comum não encontrada ou inativa.');

    const conflict = await prisma.booking.findFirst({
      where: {
        commonAreaId: data.commonAreaId,
        status: { not: 'CANCELLED' }, 
        OR: [
          { date: { lte: startDate }, endDate: { gt: startDate } },
          { date: { lt: endDate }, endDate: { gte: endDate } },
          { date: { gte: startDate }, endDate: { lte: endDate } }
        ]
      }
    });

    if (conflict) {
      throw new ConflictException('Horário indisponível para esta área.');
    }

    try {
      const booking = await prisma.booking.create({
        data: {
          commonAreaId: data.commonAreaId,
          userId: data.userId,
          date: startDate,
          endDate: endDate,
          status: 'PENDING' 
        }
      });

      return this.mapToDto(booking);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao criar reserva.');
    }
  }

  async findAll(): Promise<BookingResponseDto[]> {
    const bookings = await prisma.booking.findMany({
      orderBy: { date: 'desc' },
      include: {
        user: { select: { nome: true } }, 
        commonArea: { select: { name: true } } 
      }
    });
    
    return bookings.map(booking => this.mapToDto(booking));
  }

  async findOne(id: string): Promise<BookingResponseDto> {
    const booking = await prisma.booking.findUnique({ where: { id } });
    if (!booking) throw new NotFoundException(`Reserva com ID ${id} não encontrada.`);
    
    return this.mapToDto(booking);
  }

  async update(id: string, data: UpdateBookingDto): Promise<BookingResponseDto> {
    await this.findOne(id);

    try {
        const updated = await prisma.booking.update({
            where: { id },
            data: {
                ...data,
                status: data.status ? (data.status as any) : undefined 
            },
        });
        return this.mapToDto(updated);
    } catch (error) {
        throw new InternalServerErrorException('Erro ao atualizar reserva.');
    }
  }

  async remove(id: string): Promise<void> {
    await this.findOne(id);
    await prisma.booking.delete({ where: { id } });
  }
}