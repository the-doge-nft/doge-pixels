export enum PixelArtTool {
    pen = 0,
    erase,
}

// mrodionov: order of elements should foloow the enum above
export const pixelArtTools = [
    {
        id: PixelArtTool.pen,
        icon: 'toolPen',
    },
    {
        id: PixelArtTool.erase,
        icon: 'toolErase',
    },
];
