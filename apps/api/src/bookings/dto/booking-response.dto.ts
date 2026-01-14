import { ApiProperty } from '@nestjs/swagger';
import { BookingStatus } from './update-booking.dto';

export class BookingResponseDto {
  @ApiProperty({
    description: 'ID único da reserva',
    example: 'b123c456-d789-0123-4567-e890f123a456',
  })
  id: string;

  @ApiProperty({
    description: 'ID da área comum reservada',
    example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
  })
  commonAreaId: string;

  @ApiProperty({
    description: 'ID do usuário que fez a reserva',
    example: 'a123b456-7890-1234-5678-abc123def456',
  })
  userId: string;

  @ApiProperty({
    description: 'Data de início da reserva',
    example: '2026-02-15T14:00:00.000Z',
  })
  date: Date;

  @ApiProperty({
    description: 'Data de fim da reserva',
    example: '2026-02-15T18:00:00.000Z',
    required: false,
    nullable: true,
  })
  endDate: Date | null;

  @ApiProperty({
    description: 'Status atual da reserva',
    enum: BookingStatus,
    example: BookingStatus.CONFIRMED,
  })
  status: BookingStatus;

  @ApiProperty({
    description: 'Data de criação da reserva',
    example: '2026-01-12T09:30:00.000Z',
  })
  criadoEm: Date;
}