import { Object3D, PerspectiveCamera, WebGLRenderer } from "three";
import { Vector3 } from "three/src/math/Vector3";
import { CameraPositionZ, IMAGE_HEIGHT, IMAGE_WIDTH } from "./DogeExplorer";
import { RefObject } from "react";

export const getPixelIndex = (point: number, length: number) => {
  //@TODO: should 0.5 & 2 be params
  return Math.round(point - 0.5) / length + length / 2;
};

export const getWorldPixelCoordinate = (point: Vector3, worldPixelLength: number) => {
  return [getPixelIndex(point.x, worldPixelLength), getPixelIndex(point.y, worldPixelLength)];
};

export const getVisibleCoordinates = (
  cameraPosition: Vector3,
  cameraFOV: number,
  cameraAspect: number,
  depth: number,
) => {
  const height = getVisibleHeightAtZDepth(cameraPosition, cameraFOV, depth);
  const width = height * cameraAspect;

  const x1 = cameraPosition.x - width / 2;
  const x2 = cameraPosition.x + width / 2;
  const y1 = cameraPosition.y - height / 2;
  const y2 = cameraPosition.y + height / 2;
  return [x1, x2, y1, y2];
};

const getVisibleHeightAtZDepth = (cameraPosition: Vector3, cameraFOV: number, depth: number) => {
  // compensate for cameras not positioned at z=0
  const cameraOffset = cameraPosition.z;
  if (depth < cameraOffset) depth -= cameraOffset;
  else depth += cameraOffset;

  // vertical fov in radians
  const vFOV = (cameraFOV * Math.PI) / 180;

  // Math.abs to ensure the result is always positive
  return 2 * Math.tan(vFOV / 2) * Math.abs(depth);
};

export const solveForBounds = (cameraPosition: Vector3, cameraFOV: number, cameraAspect: number, depth: number) => {
  const height = getVisibleHeightAtZDepth(cameraPosition, cameraFOV, depth);
  const width = height * cameraAspect;
  return [width / 2, IMAGE_WIDTH - 1 - width / 2, -IMAGE_HEIGHT + height / 2, -height / 2 - 1];
};

export function createCanvasPixelSelectionSetter(
  camera: PerspectiveCamera,
  overlayLength: number,
  selectedPixelOverlayRef: RefObject<Object3D>,
) {
  return {
    selectPixel: ([x, y, z]: [number, number, number?]) => {
      const xPos = x;
      const yPos = -1 * y;

      const futureX = xPos - overlayLength / 2;
      const futureY = yPos - overlayLength / 2;
      let futureZ = CameraPositionZ.close;

      if (z !== undefined) {
        futureZ = z;
      }

      camera.position.x = futureX;
      camera.position.y = futureY;
      camera.position.z = futureZ;

      if (selectedPixelOverlayRef?.current) {
        selectedPixelOverlayRef.current.visible = true;
        [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [
          xPos - overlayLength / 2,
          yPos - overlayLength / 2,
        ];
      }
    },
    deselectPixel: () => {
      if (selectedPixelOverlayRef?.current) {
        selectedPixelOverlayRef.current.visible = false;
      }
    },
  };
}

export function resizeCanvas(gl: WebGLRenderer, camera: PerspectiveCamera) {
  const width = gl.domElement.parentElement!.clientWidth;
  const height = gl.domElement.parentElement!.clientHeight;
  camera.aspect = width / height;
  gl.setSize(width, height);
  camera.updateProjectionMatrix();
}
