import { IsEmail, IsNotEmpty, IsString, MinLength, IsUUID, IsEnum, IsOptional } from 'class-validator';

// Vamos garantir que o tipo seja um desses três
export enum UserType {
  SINDICO = 'SINDICO',
  MORADOR = 'MORADOR',
  PORTEIRO = 'PORTEIRO',
}

export class CreateUserDto {
  @IsString({ message: 'O nome deve ser um texto.' })
  @IsNotEmpty({ message: 'O nome é obrigatório.' })
  nome: string;

  @IsEmail({}, { message: 'Informe um e-mail válido.' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
  email: string;

  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
  senha: string;

  @IsEnum(UserType, { message: 'O tipo deve ser SINDICO, MORADOR ou PORTEIRO.' })
  tipo: UserType;

  @IsUUID('4', { message: 'ID do condomínio inválido.' })
  @IsNotEmpty()
  condominioId: string;

  @IsUUID('4', { message: 'ID da unidade inválido.' })
  @IsOptional() // Unidade é opcional (ex: Porteiro ou Síndico externo podem não ter apê)
  unidadeId?: string;
}