import { IsString, IsNotEmpty, IsOptional, MinLength } from 'class-validator';

export class CreateCondominioDto {
    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome do condomínio é obrigatório.' })
    @MinLength(3, { message: 'O nome deve ter pelo menos 3 caracteres.' })
    nome: string;

    @IsString()
    @IsOptional()
    endereco?: string;
}