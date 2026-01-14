import { ApiProperty } from '@nestjs/swagger';
import { TipoAviso } from './create-aviso.dto';

export class AvisoResponseDto {
  @ApiProperty({
    description: 'ID único do aviso',
    example: 'a8b9c0d1-e2f3-4a5b-6c7d-8e9f0a1b2c3d',
  })
  id: string;

  @ApiProperty({
    description: 'Título do aviso',
    example: 'Manutenção do Elevador',
  })
  titulo: string;

  @ApiProperty({
    description: 'Descrição detalhada',
    example: 'O elevador social estará parado das 14h às 16h.',
  })
  descricao: string;

  @ApiProperty({
    description: 'Nível de urgência',
    enum: TipoAviso,
    example: TipoAviso.GERAL,
  })
  tipo: TipoAviso;

  @ApiProperty({
    description: 'Data programada para o evento',
    example: '2026-01-20T10:00:00.000Z',
    required: false,
    nullable: true,
  })
  dataEvento: Date | null;

  @ApiProperty({
    description: 'Data de criação do aviso',
    example: '2026-01-10T08:00:00.000Z',
  })
  criadoEm: Date;
}