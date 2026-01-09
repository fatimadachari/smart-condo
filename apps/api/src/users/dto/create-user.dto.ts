import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';

// Ajuste os valores conforme o seu schema.prisma (Enum Role)
export enum UserRole {
  ADMIN = 'ADMIN',
  SINDICO = 'SINDICO',
  PORTEIRO = 'PORTEIRO',
  MORADOR = 'MORADOR',
}

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  @IsNotEmpty()
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  password: string;

  @IsEnum(UserRole, { message: 'Tipo de usuário inválido' })
  role: UserRole;

  @IsUUID()
  @IsOptional()
  condominioId?: string; // Síndicos e Porteiros precisam disso

  @IsUUID()
  @IsOptional()
  unidadeId?: string; // Moradores precisam disso
}