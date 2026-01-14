import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUnidadeDto } from './create-unidade.dto';

export class UpdateUnidadeDto extends PartialType(CreateUnidadeDto) {
    @ApiPropertyOptional({
        description: 'Identificação da unidade',
        example: '102',
    })
    identificacao?: string;

    @ApiPropertyOptional({
        description: 'Bloco ou torre',
        example: 'Bloco B',
    })
    bloco?: string;

    @ApiPropertyOptional({
        description: 'ID do condomínio',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    condominioId?: string;
}