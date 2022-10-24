import { Test, TestingModule } from '@nestjs/testing';
import { OwnTheDogeContractService } from './ownthedoge-contracts.service';

describe('PixelsService', () => {
  let service: OwnTheDogeContractService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [OwnTheDogeContractService],
    }).compile();

    service = module.get<OwnTheDogeContractService>(OwnTheDogeContractService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
