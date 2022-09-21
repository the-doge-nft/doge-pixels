import { Test, TestingModule } from '@nestjs/testing';
import { PixelImageGeneratorService } from './pixel-image-generator.service';

describe('PixelImageGeneratorService', () => {
  let service: PixelImageGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixelImageGeneratorService],
    }).compile();

    service = module.get<PixelImageGeneratorService>(PixelImageGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
