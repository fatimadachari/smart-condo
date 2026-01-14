import { ApiProperty } from '@nestjs/swagger';

export class UnidadeResponseDto {
  @ApiProperty({
    description: 'ID único da unidade',
    example: 'u1122334-4455-6677-8899-aabbccddeeff',
  })
  id: string;

  @ApiProperty({
    description: 'Identificação da unidade',
    example: 'Apto 101',
  })
  identificacao: string;

  @ApiProperty({
    description: 'Bloco ou Torre',
    example: 'Bloco A',
    required: false,
    nullable: true,
  })
  bloco: string | null;

  @ApiProperty({
    description: 'ID do condomínio vinculado',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  condominioId: string;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2026-01-05T14:20:00.000Z',
  })
  criadoEm: Date;
}