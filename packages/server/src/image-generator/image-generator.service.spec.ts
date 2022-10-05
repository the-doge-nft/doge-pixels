import { Test, TestingModule } from '@nestjs/testing';
import { ImageGeneratorService } from './image-generator.service';

describe('PixelImageGeneratorService', () => {
  let service: ImageGeneratorService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ImageGeneratorService],
    }).compile();

    service = module.get<ImageGeneratorService>(ImageGeneratorService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
