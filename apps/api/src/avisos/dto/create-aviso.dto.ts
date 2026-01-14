import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum TipoAviso {
    GERAL = 'GERAL',
    URGENTE = 'URGENTE',
}

export class CreateAvisoDto {
    @ApiProperty({
        description: 'Título do aviso',
        example: 'Manutenção do Elevador',
    })
    @IsString({ message: 'O título deve ser um texto.' })
    @IsNotEmpty({ message: 'O título é obrigatório.' })
    titulo: string;

    @ApiProperty({
        description: 'Descrição detalhada do aviso',
        example: 'O elevador social estará em manutenção das 14h às 16h.',
    })
    @IsString({ message: 'A descrição deve ser um texto.' })
    @IsNotEmpty({ message: 'A descrição é obrigatória.' })
    descricao: string;

    @ApiProperty({
        description: 'Nível de urgência do aviso',
        enum: TipoAviso,
        example: TipoAviso.GERAL,
        required: false,
    })
    @IsOptional()
    @IsEnum(TipoAviso, { message: 'Tipo de aviso inválido.' })
    tipo?: TipoAviso;

    @ApiProperty({
        description: 'Data do evento (ISO 8601)',
        example: '2026-01-20T10:00:00Z',
        required: false,
    })
    @IsOptional()
    @IsDateString({}, { message: 'Data do evento inválida (use formato ISO).' })
    dataEvento?: string;
}