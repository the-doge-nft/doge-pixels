import { IconName } from "../../DSL/Icon/Icon";

export enum PixelArtTool {
  pen = 0,
  erase,
  stickers,
}

// mrodionov: order of elements should foloow the enum above
export const pixelArtTools: { id: PixelArtTool; icon: IconName; description: string }[] = [
  {
    id: PixelArtTool.pen,
    icon: "toolPen",
    description: "Draw",
  },
  {
    id: PixelArtTool.erase,
    icon: "toolErase",
    description: "Erase",
  },
  {
    id: PixelArtTool.stickers,
    icon: "toolStickers",
    description: "Position stickers",
  },
];
