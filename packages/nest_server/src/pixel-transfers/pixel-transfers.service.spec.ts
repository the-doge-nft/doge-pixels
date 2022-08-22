import { Test, TestingModule } from '@nestjs/testing';
import { PixelTransfersService } from './pixel-transfers.service';

describe('PixelTransfersService', () => {
  let service: PixelTransfersService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixelTransfersService],
    }).compile();

    service = module.get<PixelTransfersService>(PixelTransfersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
