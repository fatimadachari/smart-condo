import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCondominioDto } from './dto/create-condominio.dto';
import { UpdateCondominioDto } from './dto/update-condominio.dto';
import { prisma } from '@smart-condo/database';

@Injectable()
export class CondominiosService {

    async create(data: CreateCondominioDto) {
        // ... (código que já fizemos fica igual)
        try {
            return await prisma.condominio.create({ data });
        } catch (error) {
            if (error.code === 'P2002') throw new ConflictException('Já existe um condomínio com este dado único.');
            throw new InternalServerErrorException('Erro ao processar solicitação.');
        }
    }

    async findAll() {
        return await prisma.condominio.findMany();
    }

    async findOne(id: string) {
        const condominio = await prisma.condominio.findUnique({
            where: { id },
        });

        if (!condominio) {
            throw new NotFoundException(`Condomínio com ID ${id} não encontrado.`);
        }

        return condominio;
    }

    async update(id: string, data: UpdateCondominioDto) {
        // Primeiro verificamos se existe usando o método que já criamos acima
        await this.findOne(id);

        return await prisma.condominio.update({
            where: { id },
            data,
        });
    }

    async remove(id: string) {
        await this.findOne(id); // Garante que existe antes de tentar deletar

        return await prisma.condominio.delete({
            where: { id },
        });
    }
}