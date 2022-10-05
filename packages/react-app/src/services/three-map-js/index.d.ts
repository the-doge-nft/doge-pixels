import { Object3D } from "three";

interface Dispose {
  dispose: () => void;
}

export type PanZoomReturn = EventType & Dispose;

declare function panzoom(
  camera: Object3D,
  owner: HTMLElement,
  toKeepInBounds: Object3D,
  minDepth: number,
  maxDepth: number,
): PanZoomReturn;

export = panzoom;
