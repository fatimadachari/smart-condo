import { PartialType } from '@nestjs/mapped-types';
import { CreateBookingDto } from './create-booking.dto';
import { IsEnum, IsOptional } from 'class-validator';

// Precisamos replicar o Enum do Prisma aqui ou importar se tiver um pacote compartilhado
enum BookingStatus {
  PENDING = 'PENDING',
  CONFIRMED = 'CONFIRMED',
  CANCELLED = 'CANCELLED',
  REJECTED = 'REJECTED',
}

export class UpdateBookingDto extends PartialType(CreateBookingDto) {
    @IsEnum(BookingStatus)
    @IsOptional()
    status?: BookingStatus;
}