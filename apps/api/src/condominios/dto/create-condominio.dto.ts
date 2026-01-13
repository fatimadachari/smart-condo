import { IsString, IsNotEmpty, IsOptional, MinLength, MaxLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCondominioDto {
    @ApiProperty({
        description: 'Nome do condomínio',
        example: 'Residencial Jardim das Flores',
        minLength: 3,
        maxLength: 100,
    })
    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome do condomínio é obrigatório.' })
    @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    @MaxLength(100, { message: 'O nome deve ter no máximo 100 caracteres.' })
    nome: string;

    @ApiProperty({
        description: 'Endereço completo do condomínio',
        example: 'Rua das Palmeiras, 123 - Centro - São Paulo/SP - CEP: 01234-567',
        required: false,
        maxLength: 255,
    })
    @IsString({ message: 'O endereço deve ser um texto.' })
    @IsOptional()
    @MaxLength(255, { message: 'O endereço deve ter no máximo 255 caracteres.' })
    endereco?: string;
}