import { Test, TestingModule } from '@nestjs/testing';
import { AvisosController } from './avisos.controller';
import { AvisosService } from './avisos.service';
import { BadRequestException } from '@nestjs/common';

describe('AvisosController', () => {
  let controller: AvisosController;
  let service: AvisosService;

  const mockAvisosService = {
    create: jest.fn(),
    findAll: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvisosController],
      providers: [{ provide: AvisosService, useValue: mockAvisosService }],
    }).compile();

    controller = module.get<AvisosController>(AvisosController);
    service = module.get<AvisosService>(AvisosService);
  });

  describe('create', () => {
    it('deve chamar service.create extraindo IDs do request', async () => {
      const dto = { titulo: 'Aviso', descricao: 'Desc' };
      
      const req = {
        user: { id: 'user123', condominioId: 'cond123' },
      };

      await controller.create(dto as any, req);

      expect(service.create).toHaveBeenCalledWith(dto, 'user123', 'cond123');
    });

    it('deve lançar erro se usuário não tiver condomínio', async () => {
      const req = { user: { id: 'admin_global' } };

      try {
        await controller.create({} as any, req);
        fail('Deveria ter lançado BadRequestException');
      } catch (error) {
        expect(error).toBeInstanceOf(BadRequestException);
      }
    });
  });
});