import { IsString, IsNotEmpty, IsDate, IsOptional, IsUUID } from 'class-validator';
import { Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';

export class CreateBookingDto {
    @ApiProperty({
        description: 'ID da área comum a ser reservada',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    @IsUUID('4', { message: 'O ID da área comum deve ser um UUID válido.' })
    @IsNotEmpty({ message: 'O ID da área comum é obrigatório.' })
    commonAreaId: string;

    @ApiProperty({
        description: 'ID do usuário que está reservando',
        example: 'a123b456-7890-1234-5678-abc123def456',
    })
    @IsUUID('4', { message: 'O ID do usuário deve ser um UUID válido.' })
    @IsNotEmpty({ message: 'O ID do usuário é obrigatório.' })
    userId: string;

    @ApiProperty({
        description: 'Data e hora de início da reserva (ISO 8601)',
        example: '2026-02-15T14:00:00.000Z',
    })
    @IsDate({ message: 'Data de início inválida.' })
    @Type(() => Date)
    @IsNotEmpty({ message: 'A data de início é obrigatória.' })
    date: Date;

    @ApiProperty({
        description: 'Data e hora de término da reserva',
        example: '2026-02-15T18:00:00.000Z',
        required: false,
    })
    @IsDate({ message: 'Data de fim inválida.' })
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;
}