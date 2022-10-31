import { Test, TestingModule } from '@nestjs/testing';
import { RainbowSwapsService } from './rainbow-swaps.service';

describe('RainbowSwapsService', () => {
  let service: RainbowSwapsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RainbowSwapsService],
    }).compile();

    service = module.get<RainbowSwapsService>(RainbowSwapsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
