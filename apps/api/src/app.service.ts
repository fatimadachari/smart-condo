import { Injectable } from '@nestjs/common';
import { prisma } from '@smart-condo/database'; // <--- Olha o import do nosso pacote aqui!

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    // Vamos tentar contar quantos condomínios existem
    const total = await prisma.condominio.count();
    return `O sistema está conectado! Total de condomínios: ${total}`;
  }
}