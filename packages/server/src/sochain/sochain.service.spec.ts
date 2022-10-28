import { Test, TestingModule } from '@nestjs/testing';
import { SochainService } from './sochain.service';

describe('SochainService', () => {
  let service: SochainService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SochainService],
    }).compile();

    service = module.get<SochainService>(SochainService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
