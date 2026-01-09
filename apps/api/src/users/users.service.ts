import { Injectable, ConflictException, NotFoundException, InternalServerErrorException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { prisma } from '@smart-condo/database';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  
  private mapToFrontend(user: any) {
    const { senha, ...rest } = user;
    return {
      ...rest,
      name: user.nome,
      role: user.tipo,
    };
  }

  async create(data: CreateUserDto) {
    const userExists = await prisma.user.findUnique({
      where: { email: data.email },
    });

    if (userExists) {
      throw new ConflictException('Este e-mail já está cadastrado.');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    // SOLUÇÃO: Montamos o objeto manualmente para evitar o erro de tipo
    // Usamos 'any' aqui pontualmente ou construímos condicionalmente
    const payload: any = {
        nome: data.name,
        email: data.email,
        senha: hashedPassword,
        tipo: data.role,
    };

    // Só adicionamos o ID se ele realmente existir (evita passar undefined)
    if (data.condominioId) {
        payload.condominioId = data.condominioId;
    }
    
    // Se tiver unidade no futuro:
    // if (data.unidadeId) payload.unidadeId = data.unidadeId;

    try {
      const user = await prisma.user.create({
        data: payload, // Agora o TS aceita
      });

      return this.mapToFrontend(user);

    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Erro ao criar usuário.');
    }
  }

  // ... findAll, findOne, remove (mantêm iguais) ...

  async update(id: string, data: UpdateUserDto) {
    await this.findOne(id);

    const dataToUpdate: any = { 
        email: data.email,
        // condominioId: data.condominioId // Se deixar aqui direto pode dar erro se for undefined
    };

    if (data.condominioId) dataToUpdate.condominioId = data.condominioId;
    if (data.name) dataToUpdate.nome = data.name;
    if (data.role) dataToUpdate.tipo = data.role;
    if (data.password) {
      dataToUpdate.senha = await bcrypt.hash(data.password, 10);
    }

    try {
      const user = await prisma.user.update({
        where: { id },
        data: dataToUpdate,
      });
      return this.mapToFrontend(user);
    } catch (error) {
      throw new InternalServerErrorException('Erro ao atualizar usuário.');
    }
  }
  
  // Mantenha os outros métodos...
  async findAll() {
    const users = await prisma.user.findMany({
      orderBy: { nome: 'asc' }, 
      include: {
        condominio: { select: { nome: true } },
      }
    });
    return users.map(user => this.mapToFrontend(user));
  }

  async findOne(id: string) {
    const user = await prisma.user.findUnique({
      where: { id },
      include: {
        condominio: true,
      }
    });
    if (!user) throw new NotFoundException('Usuário não encontrado.');
    return this.mapToFrontend(user);
  }

  async remove(id: string) {
    await this.findOne(id);
    return await prisma.user.delete({ where: { id } });
  }
}