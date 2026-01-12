import { IsString, IsNotEmpty, IsOptional, IsInt, IsBoolean, Min } from 'class-validator';

export class CreateCommonAreaDto {
    @IsString({ message: 'O nome deve ser um texto.' })
    @IsNotEmpty({ message: 'O nome da área é obrigatório.' })
    name: string;

    @IsString()
    @IsOptional()
    description?: string;

    @IsInt({ message: 'A capacidade deve ser um número inteiro.' })
    @Min(1, { message: 'A capacidade deve ser de pelo menos 1 pessoa.' })
    @IsOptional()
    capacity?: number;

    @IsString()
    @IsOptional()
    photoUrl?: string;

    @IsBoolean()
    @IsOptional()
    isActive?: boolean;
}