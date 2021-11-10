import { useEffect } from "react";
import { Vector3 } from "three/src/math/Vector3";

export const getPixelIndex = (point: number, length: number) => {
  return Math.round(point - 0.5) / length + length / 2;
};

export const getWorldPixelCoordinate = (point: Vector3, worldPixelLength: number) => {
  return [getPixelIndex(point.x, worldPixelLength), getPixelIndex(point.y, worldPixelLength)];
};

export const addListenerIfNotExists = (node: HTMLElement, event: any, fn: any) => {
  if (node.getAttribute(event) !== "true") {
    // console.log("debug:: clean up - add listener ::", fn.name)
    node.addEventListener(event, fn, false)
    node.setAttribute(event, "true")
  }
  return () => node.removeEventListener(event, fn)
}

export const useCleanup = (fns: (() => void)[]) => {
  useEffect(() => {
    // console.log("debug:: clean up mount :: ", fns.length)
    return () => {
      // console.log("debug:: cleaning up ", fns.length, " functions");
      fns.forEach(fn => {
        fn();
        // console.log("debug:: cleaning up ::", fn.name)
      });
    };
  }, []);
};

export const updatePixelPosition = () => {};
