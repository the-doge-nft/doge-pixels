import { Test, TestingModule } from '@nestjs/testing';
import {PixelsRepository} from "./pixels.repository";

describe('PixelsRepository', () => {
    let service: PixelsRepository;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [PixelsRepository],
        }).compile();

        service = module.get<PixelsRepository>(PixelsRepository);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });
});
