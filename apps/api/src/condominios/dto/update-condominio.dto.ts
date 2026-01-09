import { PartialType } from '@nestjs/mapped-types';
import { CreateCondominioDto } from './create-condominio.dto';

// O PartialType herda tudo do Create, mas torna as propriedades opcionais.
// Se no Create o nome é obrigatório, aqui ele vira opcional (mas se for enviado, tem que ser string e ter 3 chars)
export class UpdateCondominioDto extends PartialType(CreateCondominioDto) {}