import { IsNotEmpty, IsString, IsOptional, IsEnum, IsDateString } from 'class-validator';

export enum TipoAviso {
    GERAL = 'GERAL',
    URGENTE = 'URGENTE',
}

export class CreateAvisoDto {
    @IsString()
    @IsNotEmpty()
    titulo: string;

    @IsString()
    @IsNotEmpty()
    descricao: string;

    @IsOptional()
    @IsEnum(TipoAviso)
    tipo?: TipoAviso;

    @IsOptional()
    @IsDateString() 
    dataEvento?: string;
}