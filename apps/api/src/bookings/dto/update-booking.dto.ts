import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEnum, IsOptional } from 'class-validator';
import { CreateBookingDto } from './create-booking.dto';

// Se possível, mova este Enum para um arquivo compartilhado (ex: booking-status.enum.ts)
export enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @ApiPropertyOptional({
        description: 'ID da área comum',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    commonAreaId?: string;

    @ApiPropertyOptional({
        description: 'ID do usuário',
        example: 'a123b456-7890-1234-5678-abc123def456',
    })
    userId?: string;

    @ApiPropertyOptional({
        description: 'Data de início da reserva',
        example: '2026-02-15T15:00:00.000Z',
    })
    date?: Date;

    @ApiPropertyOptional({
        description: 'Data de fim da reserva',
        example: '2026-02-15T19:00:00.000Z',
    })
    endDate?: Date;

    @ApiPropertyOptional({
        description: 'Status da reserva',
        enum: BookingStatus,
        example: BookingStatus.CONFIRMED,
    })
    @IsEnum(BookingStatus, { message: 'Status inválido.' })
    @IsOptional()
    status?: BookingStatus;
}