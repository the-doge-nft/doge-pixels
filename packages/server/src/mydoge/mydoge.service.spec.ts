import { Test, TestingModule } from '@nestjs/testing';
import { MydogeService } from './mydoge.service';

describe('MydogeService', () => {
  let service: MydogeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MydogeService],
    }).compile();

    service = module.get<MydogeService>(MydogeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
