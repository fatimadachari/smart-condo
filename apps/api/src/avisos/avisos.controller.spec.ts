import { Test, TestingModule } from '@nestjs/testing';
import { AvisosController } from './avisos.controller';
import { AvisosService } from './avisos.service';

describe('AvisosController', () => {
  let controller: AvisosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AvisosController],
      providers: [AvisosService],
    }).compile();

    controller = module.get<AvisosController>(AvisosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
