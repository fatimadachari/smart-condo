import { Injectable, ConflictException, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { CreateCondominioDto } from './dto/create-condominio.dto';
import { UpdateCondominioDto } from './dto/update-condominio.dto';
import { PaginationQueryDto } from '../common/dto/pagination-query.dto';
import { PaginatedResponseDto } from '../common/dto/paginated-response.dto';
import { CondominioResponseDto } from './dto/condominio-response.dto';
import { prisma } from '@smart-condo/database';

@Injectable()
export class CondominiosService {

    async create(data: CreateCondominioDto): Promise<CondominioResponseDto> {
        try {
            return await prisma.condominio.create({ data });
        } catch (error) {
            if (error.code === 'P2002') {
                throw new ConflictException('Já existe um condomínio com este dado único.');
            }
            throw new InternalServerErrorException('Erro ao processar solicitação.');
        }
    }

    async findAll(query: PaginationQueryDto): Promise<PaginatedResponseDto<CondominioResponseDto>> {
        const { page = 1, perPage = 10, search } = query;
        
        const skip = (page - 1) * perPage;
        
        const where = search
            ? {
                nome: {
                    contains: search,
                    mode: 'insensitive' as const,
                },
            }
            : {};

        const [condominios, total] = await Promise.all([
            prisma.condominio.findMany({
                where,
                skip,
                take: perPage,
                orderBy: {
                    criadoEm: 'desc',
                },
            }),
            prisma.condominio.count({ where }),
        ]);

        return new PaginatedResponseDto(condominios, page, perPage, total);
    }

    async findOne(id: string): Promise<CondominioResponseDto> {
        const condominio = await prisma.condominio.findUnique({
            where: { id },
        });

        if (!condominio) {
            throw new NotFoundException(`Condomínio com ID ${id} não encontrado.`);
        }

        return condominio;
    }

    async update(id: string, data: UpdateCondominioDto): Promise<CondominioResponseDto> {
        await this.findOne(id);

        return await prisma.condominio.update({
            where: { id },
            data,
        });
    }

    async remove(id: string, force: boolean = false): Promise<void> {
        await this.findOne(id);

        try {
            if (force) {
                await prisma.$transaction([
                    prisma.aviso.deleteMany({ where: { condominioId: id } }),
                    prisma.user.deleteMany({ where: { condominioId: id } }),
                    prisma.unidade.deleteMany({ where: { condominioId: id } }),
                    prisma.condominio.delete({ where: { id } }),
                ]);
            } else {
                await prisma.condominio.delete({
                    where: { id },
                });
            }
        } catch (error) {
            if (error.code === 'P2003') {
                throw new ConflictException('EXIST_DEPENDENCY');
            }
            console.error(error);
            throw new InternalServerErrorException('Erro ao excluir condomínio.');
        }
    }
}