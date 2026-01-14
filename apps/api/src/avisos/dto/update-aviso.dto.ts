import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateAvisoDto, TipoAviso } from './create-aviso.dto';

export class UpdateAvisoDto extends PartialType(CreateAvisoDto) {
    @ApiPropertyOptional({
        description: 'Título do aviso',
        example: 'Manutenção do Elevador (Atualizado)',
    })
    titulo?: string;

    @ApiPropertyOptional({
        description: 'Descrição detalhada do aviso',
        example: 'A manutenção foi reagendada para às 16h.',
    })
    descricao?: string;

    @ApiPropertyOptional({
        description: 'Nível de urgência do aviso',
        enum: TipoAviso,
        example: TipoAviso.URGENTE,
    })
    tipo?: TipoAviso;

    @ApiPropertyOptional({
        description: 'Data do evento (ISO 8601)',
        example: '2026-01-21T10:00:00Z',
    })
    dataEvento?: string;
}