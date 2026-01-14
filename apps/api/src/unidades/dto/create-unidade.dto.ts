import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUnidadeDto {
    @ApiProperty({
        description: 'Identificação da unidade (número ou nome)',
        example: '101',
    })
    @IsString({ message: 'A identificação deve ser um texto.' })
    @IsNotEmpty({ message: 'A identificação é obrigatória (ex: 101, Apto 20).' })
    identificacao: string;

    @ApiProperty({
        description: 'Bloco ou torre da unidade',
        example: 'Bloco A',
        required: false,
    })
    @IsString({ message: 'O bloco deve ser um texto.' })
    @IsOptional()
    bloco?: string;

    @ApiProperty({
        description: 'ID do condomínio ao qual a unidade pertence',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    @IsUUID('4', { message: 'ID do condomínio inválido.' })
    @IsNotEmpty({ message: 'O condomínio é obrigatório.' })
    condominioId: string;
}