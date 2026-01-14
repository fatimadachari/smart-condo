import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class LoginDto {
    @ApiProperty({
        description: 'E-mail do usuário',
        example: 'usuario@email.com',
    })
    @IsEmail({}, { message: 'E-mail inválido.' })
    @IsNotEmpty({ message: 'O e-mail é obrigatório.' })
    email: string;

    @ApiProperty({
        description: 'Senha de acesso',
        example: 'senhaSegura123',
        minLength: 6,
    })
    @IsString({ message: 'A senha deve ser um texto.' })
    @IsNotEmpty({ message: 'A senha é obrigatória.' })
    @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres.' })
    senha: string;
}