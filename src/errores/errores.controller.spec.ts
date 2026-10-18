import { Test, TestingModule } from '@nestjs/testing';
import { ErroresController } from './errores.controller.js';

describe('ErroresController', () => {
  let controller: ErroresController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ErroresController],
    }).compile();

    controller = module.get<ErroresController>(ErroresController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
