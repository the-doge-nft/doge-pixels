import { Test, TestingModule } from '@nestjs/testing';
import { PixelTransferService } from './pixel-transfer.service';

describe('PixelTransfersService', () => {
  let service: PixelTransferService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixelTransferService],
    }).compile();

    service = module.get<PixelTransferService>(PixelTransferService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
