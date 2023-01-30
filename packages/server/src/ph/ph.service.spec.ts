import { Test, TestingModule } from '@nestjs/testing';
import { PhService } from './ph.service';

describe('PhService', () => {
  let service: PhService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [PhService],
    }).compile();

    service = module.get<PhService>(PhService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
