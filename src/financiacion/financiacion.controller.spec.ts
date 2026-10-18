import { Test, TestingModule } from '@nestjs/testing';
import { FinanciacionController } from './financiacion.controller.js';

describe('FinanciacionController', () => {
  let controller: FinanciacionController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [FinanciacionController],
    }).compile();

    controller = module.get<FinanciacionController>(FinanciacionController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
