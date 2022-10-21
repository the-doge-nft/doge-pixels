import { Test, TestingModule } from '@nestjs/testing';
import { RainbowService } from './rainbow.service';

describe('RainbowService', () => {
  let service: RainbowService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RainbowService],
    }).compile();

    service = module.get<RainbowService>(RainbowService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
