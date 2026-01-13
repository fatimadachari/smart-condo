import { PartialType } from '@nestjs/mapped-types';
import { CreateCondominioDto } from './create-condominio.dto';
import { ApiPropertyOptional } from '@nestjs/swagger';

export class UpdateCondominioDto extends PartialType(CreateCondominioDto) {
    @ApiPropertyOptional({
        description: 'Nome do condomínio',
        example: 'Residencial Jardim das Flores',
        minLength: 3,
        maxLength: 100,
    })
    nome?: string;

    @ApiPropertyOptional({
        description: 'Endereço completo do condomínio',
        example: 'Rua das Palmeiras, 123 - Centro - São Paulo/SP - CEP: 01234-567',
        maxLength: 255,
    })
    endereco?: string;
}