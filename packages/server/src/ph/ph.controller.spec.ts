import { Test, TestingModule } from '@nestjs/testing';
import { PhController } from './ph.controller';

describe('PhController', () => {
  let controller: PhController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PhController],
    }).compile();

    controller = module.get<PhController>(PhController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
