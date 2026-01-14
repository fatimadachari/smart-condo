import { Injectable } from '@nestjs/common';
import { prisma } from '@smart-condo/database';

@Injectable()
export class AppService {
  async getHello(): Promise<string> {
    const total = await prisma.condominio.count();
    return `O sistema está conectado! Total de condomínios: ${total}`;
  }
}