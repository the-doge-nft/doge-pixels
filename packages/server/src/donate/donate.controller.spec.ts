import { Test, TestingModule } from '@nestjs/testing';
import { DonateController } from './donate.controller';

describe('DonateController', () => {
  let controller: DonateController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [DonateController],
    }).compile();

    controller = module.get<DonateController>(DonateController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
