import { ApiProperty } from '@nestjs/swagger';

export class CommonAreaResponseDto {
  @ApiProperty({
    description: 'ID único da área comum',
    example: 'c987d654-e321-0b1a-2c3d-4e5f6a7b8c9d',
  })
  id: string;

  @ApiProperty({
    description: 'Nome da área',
    example: 'Salão de Festas',
  })
  name: string;

  @ApiProperty({
    description: 'Descrição das comodidades',
    example: 'Equipado com churrasqueira e som.',
    required: false,
    nullable: true,
  })
  description: string | null;

  @ApiProperty({
    description: 'Capacidade máxima de pessoas',
    example: 50,
    required: false,
    nullable: true,
  })
  capacity: number | null;

  @ApiProperty({
    description: 'URL da foto da área',
    example: 'https://cdn.exemplo.com/salao.jpg',
    required: false,
    nullable: true,
  })
  photoUrl: string | null;

  @ApiProperty({
    description: 'Indica se a área está ativa para reservas',
    example: true,
  })
  isActive: boolean;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2025-12-01T10:00:00.000Z',
  })
  criadoEm: Date;
}