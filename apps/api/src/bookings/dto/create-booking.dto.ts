import { IsString, IsNotEmpty, IsDate, IsOptional, IsEnum } from 'class-validator';
import { Type } from 'class-transformer';

export class CreateBookingDto {
    @IsString({ message: 'O ID da área comum é obrigatório.' })
    @IsNotEmpty()
    commonAreaId: string;

    @IsString({ message: 'O ID do usuário é obrigatório.' }) // Em produção, pegamos do Token JWT
    @IsNotEmpty()
    userId: string;

    @IsDate({ message: 'Data de início inválida.' })
    @Type(() => Date) // Transforma string ISO em Date automaticamente
    @IsNotEmpty()
    date: Date;

    @IsDate({ message: 'Data de fim inválida.' })
    @Type(() => Date)
    @IsOptional()
    endDate?: Date;
}