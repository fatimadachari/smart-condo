import { ApiProperty } from '@nestjs/swagger';

export class CondominioResponseDto {
  @ApiProperty({
    description: 'ID único do condomínio',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'Nome do condomínio',
    example: 'Residencial Jardim das Flores',
  })
  nome: string;

  @ApiProperty({
    description: 'Endereço completo do condomínio',
    example: 'Rua das Palmeiras, 123 - Centro',
    required: false,
    nullable: true,
  })
  endereco: string | null;

  @ApiProperty({
    description: 'Data de criação do registro',
    example: '2024-01-15T10:30:00.000Z',
  })
  criadoEm: Date;
}