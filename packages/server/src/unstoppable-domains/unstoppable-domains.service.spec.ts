import { Test, TestingModule } from '@nestjs/testing';
import { UnstoppableDomainsService } from './unstoppable-domains.service';

describe('UnstoppableDomainsService', () => {
  let service: UnstoppableDomainsService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UnstoppableDomainsService],
    }).compile();

    service = module.get<UnstoppableDomainsService>(UnstoppableDomainsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
