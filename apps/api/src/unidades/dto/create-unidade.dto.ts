import { IsNotEmpty, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateUnidadeDto {
    @IsString()
    @IsNotEmpty({ message: 'A identificação é obrigatória (ex: 101, Apto 20)' })
    identificacao: string;

    @IsString()
    @IsOptional()
    bloco?: string;

    @IsUUID(undefined, { message: 'ID do condomínio inválido' })
    @IsNotEmpty({ message: 'O condomínio é obrigatório' })
    condominioId: string;
}