import { useEffect } from "react";
import { Vector3 } from "three/src/math/Vector3";

export const getPixelIndex = (point: number, length: number) => {
  return Math.round(point - 0.5) / length + length / 2;
};

export const getWorldPixelCoordinate = (point: Vector3, worldPixelLength: number) => {
  return [getPixelIndex(point.x, worldPixelLength), getPixelIndex(point.y, worldPixelLength)];
};
