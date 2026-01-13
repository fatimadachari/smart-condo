import { Test, TestingModule } from '@nestjs/testing';
import { AppController } from './app.controller';
import { AppService } from './app.service';

describe('AppController', () => {
  let appController: AppController;

  const mockAppService = {
    getHello: jest.fn().mockResolvedValue('O sistema está conectado! Total de condomínios: 0'),
  };

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppController],
      providers: [
        {
          provide: AppService,
          useValue: mockAppService,
        },
      ],
    }).compile();

    appController = app.get<AppController>(AppController);
  });

  describe('root', () => {
    it('should return connection message', async () => {
      const result = await appController.getHello();
      expect(result).toBe('O sistema está conectado! Total de condomínios: 0');
      expect(mockAppService.getHello).toHaveBeenCalled();
    });
  });
});