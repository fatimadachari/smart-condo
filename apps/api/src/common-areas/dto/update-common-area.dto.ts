import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateCommonAreaDto } from './create-common-area.dto';

export class UpdateCommonAreaDto extends PartialType(CreateCommonAreaDto) {
    @ApiPropertyOptional({
        description: 'Nome da área comum',
        example: 'Salão de Jogos',
        maxLength: 100,
    })
    name?: string;

    @ApiPropertyOptional({
        description: 'Descrição das comodidades',
        example: 'Mesa de sinuca reformada e ping-pong.',
    })
    description?: string;

    @ApiPropertyOptional({
        description: 'Capacidade máxima',
        example: 60,
        minimum: 1,
    })
    capacity?: number;

    @ApiPropertyOptional({
        description: 'URL da foto atualizada',
        example: 'https://meucondominio.com/fotos/jogos-v2.jpg',
    })
    photoUrl?: string;

    @ApiPropertyOptional({
        description: 'Disponibilidade da área',
        example: false,
    })
    isActive?: boolean;
}