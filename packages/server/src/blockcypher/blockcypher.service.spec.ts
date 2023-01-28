import { Test, TestingModule } from '@nestjs/testing';
import { BlockcypherService } from './blockcypher.service';

describe('BlockcypherService', () => {
  let service: BlockcypherService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [BlockcypherService],
    }).compile();

    service = module.get<BlockcypherService>(BlockcypherService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
