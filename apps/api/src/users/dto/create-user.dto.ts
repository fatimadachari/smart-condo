import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, IsUUID, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export enum UserRole {
    ADMIN = 'ADMIN',
    SINDICO = 'SINDICO',
    PORTEIRO = 'PORTEIRO',
    MORADOR = 'MORADOR',
}

export class CreateUserDto {
    @ApiProperty({
        description: 'Nome completo do usuário',
        example: 'Ana Clara Souza',
    })
    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome é obrigatório.' })
    name: string;

    @ApiProperty({
        description: 'E-mail para login e contato',
        example: 'ana.souza@email.com',
    })
    @IsEmail({}, { message: 'E-mail inválido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email: string;

    @ApiProperty({
        description: 'Senha de acesso',
        example: 'MinhaSenhaForte!23',
        minLength: 6,
    })
    @IsString({ message: 'A senha deve ser um texto.' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    password: string;

    @ApiProperty({
        description: 'Papel do usuário no sistema',
        enum: UserRole,
        example: UserRole.MORADOR,
    })
    @IsEnum(UserRole, { message: 'Tipo de usuário inválido.' })
    role: UserRole;

    @ApiProperty({
        description: 'ID do condomínio (Obrigatório para Síndicos e Porteiros)',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
        required: false,
    })
    @IsUUID('4', { message: 'ID do condomínio inválido.' })
    @IsOptional()
    condominioId?: string; 

    @ApiProperty({
        description: 'ID da unidade (Obrigatório para Moradores)',
        example: 'a123b456-7890-1234-5678-abc123def456',
        required: false,
    })
    @IsUUID('4', { message: 'ID da unidade inválido.' })
    @IsOptional()
    unidadeId?: string; 
}