import { PartialType } from '@nestjs/mapped-types';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { CreateUserDto, UserRole } from './create-user.dto';

export class UpdateUserDto extends PartialType(CreateUserDto) {
    @ApiPropertyOptional({
        description: 'Nome completo',
        example: 'Ana Clara de Souza',
    })
    name?: string;

    @ApiPropertyOptional({
        description: 'E-mail do usuário',
        example: 'ana.nova@email.com',
    })
    email?: string;

    @ApiPropertyOptional({
        description: 'Nova senha (deve respeitar o mínimo de caracteres)',
        example: 'NovaSenha!123',
        minLength: 6,
    })
    password?: string;

    @ApiPropertyOptional({
        description: 'Papel do usuário',
        enum: UserRole,
        example: UserRole.SINDICO,
    })
    role?: UserRole;

    @ApiPropertyOptional({
        description: 'ID do condomínio vinculado',
        example: 'd290f1ee-6c54-4b01-90e6-d701748f0851',
    })
    condominioId?: string;

    @ApiPropertyOptional({
        description: 'ID da unidade vinculada',
        example: 'a123b456-7890-1234-5678-abc123def456',
    })
    unidadeId?: string;
}