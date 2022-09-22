import { Test, TestingModule } from '@nestjs/testing';
import { PixelsService } from './pixels.service';

describe('PixelsService', () => {
  let service: PixelsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PixelsService],
    }).compile();

    service = module.get<PixelsService>(PixelsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
