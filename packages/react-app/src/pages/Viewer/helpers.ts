import { useEffect } from "react";
import { Vector3 } from "three/src/math/Vector3";
import * as THREE from "three";

export const getPixelIndex = (point: number, length: number) => {
  //@TODO: should 0.5 & 2 be params
  return Math.round(point - 0.5) / length + length / 2;
};

export const getWorldPixelCoordinate = (point: Vector3, worldPixelLength: number) => {
  return [getPixelIndex(point.x, worldPixelLength), getPixelIndex(point.y, worldPixelLength)];
};

export const getVisibleCoordinates = (camera: THREE.PerspectiveCamera, depth: number) => {
  const height = visibleHeightAtZDepth(camera, depth)
  const width = visibleWidthAtZDepth(camera, depth)

  const x1 =  camera.position.x - (width/2)
  const x2 =  camera.position.x + (width/2)
  const y1 = camera.position.y - (height/2)
  const y2 = camera.position.y + (height/2)
  return [x1, x2, y1, y2]
}

const visibleHeightAtZDepth = (camera: THREE.PerspectiveCamera, depth: number) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = camera.position.z;
  if ( depth < cameraOffset ) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = camera.fov * Math.PI / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan( vFOV / 2 ) * Math.abs( depth );
};

const visibleWidthAtZDepth = (camera: THREE.PerspectiveCamera, depth: number) => {
  const height = visibleHeightAtZDepth(camera, depth);
  return height * camera.aspect;
};
