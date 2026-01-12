import { Test, TestingModule } from '@nestjs/testing';
import { AvisosService } from './avisos.service';

describe('AvisosService', () => {
  let service: AvisosService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [AvisosService],
    }).compile();

    service = module.get<AvisosService>(AvisosService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
