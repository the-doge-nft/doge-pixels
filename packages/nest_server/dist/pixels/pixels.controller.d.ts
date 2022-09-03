import { PixelsService } from './pixels.service';
export declare class PixelsController {
    private pixelsService;
    constructor(pixelsService: PixelsService);
    testPostPixels(): Promise<{
        success: boolean;
    }>;
}
