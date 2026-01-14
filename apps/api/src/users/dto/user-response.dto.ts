import { ApiProperty } from '@nestjs/swagger';
import { UserRole } from './create-user.dto';

export class UserResponseDto {
  @ApiProperty({
    description: 'ID único do usuário',
    example: 'a123b456-7890-1234-5678-abc123def456',
  })
  id: string;

  @ApiProperty({
    description: 'Nome completo do usuário',
    example: 'Ana Clara Souza',
  })
  name: string;

  @ApiProperty({
    description: 'E-mail do usuário',
    example: 'ana.souza@email.com',
  })
  email: string;

  @ApiProperty({
    description: 'Papel do usuário no sistema',
    enum: UserRole,
    example: UserRole.MORADOR,
  })
  role: UserRole;

  @ApiProperty({
    description: 'ID do condomínio (se aplicável)',
    example: '550e8400-e29b-41d4-a716-446655440000',
    required: false,
    nullable: true,
  })
  condominioId: string | null;

  @ApiProperty({
    description: 'ID da unidade (se aplicável)',
    example: 'u1122334-4455-6677-8899-aabbccddeeff',
    required: false,
    nullable: true,
  })
  unidadeId: string | null;

  @ApiProperty({
    description: 'Data de criação do usuário',
    example: '2026-01-01T00:00:00.000Z',
  })
  criadoEm: Date;
}