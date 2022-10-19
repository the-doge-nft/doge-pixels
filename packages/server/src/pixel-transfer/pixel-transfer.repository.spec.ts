import { Test, TestingModule } from '@nestjs/testing';
import { PixelTransferRepository } from './pixel-transfer.repository';

describe('PixelsRepository', () => {
  let service: PixelTransferRepository;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixelTransferRepository],
    }).compile();

    service = module.get<PixelTransferRepository>(PixelTransferRepository);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
