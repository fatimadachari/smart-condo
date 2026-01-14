import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, Min, MaxLength, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCommonAreaDto {
    @ApiProperty({
        description: 'Nome da área comum',
        example: 'Salão de Festas',
        maxLength: 100,
    })
    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome da área é obrigatório.' })
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
    name: string;

    @ApiProperty({
        description: 'Descrição das comodidades da área',
        example: 'Espaço com churrasqueira, freezer e 10 mesas.',
        required: false,
    })
    @IsString({ message: 'A descrição deve ser um texto.' })
    @IsOptional()
    description?: string;

    @ApiProperty({
        description: 'Capacidade máxima de pessoas',
        example: 50,
        minimum: 1,
        required: false,
    })
    @IsInt({ message: 'A capacidade deve ser um número inteiro.' })
    @Min(1, { message: 'A capacidade deve ser de pelo menos 1 pessoa.' })
    @IsOptional()
    capacity?: number;

    @ApiProperty({
        description: 'URL da foto da área',
        example: 'https://meucondominio.com/fotos/salao.jpg',
        required: false,
    })
    @IsString()
    @IsOptional()
    // Sugestão: @IsUrl({}, { message: 'URL da foto inválida.' }) se quiser validar formato de link
    photoUrl?: string;

    @ApiProperty({
        description: 'Define se a área está disponível para reservas',
        example: true,
        required: false,
        default: true,
    })
    @IsBoolean({ message: 'O campo ativo deve ser verdadeiro ou falso.' })
    @IsOptional()
    isActive?: boolean;
}