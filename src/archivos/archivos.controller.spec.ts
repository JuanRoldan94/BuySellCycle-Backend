import { Test, TestingModule } from '@nestjs/testing';
import { ArchivosController } from './archivos.controller.js';

describe('ArchivosController', () => {
  let controller: ArchivosController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ArchivosController],
    }).compile();

    controller = module.get<ArchivosController>(ArchivosController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
