import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Box3, Object3D } from "three";
import { Camera, Canvas, useLoader, useThree } from "@react-three/fiber";
import KobosuImage from "../../images/kobosu.jpeg";
import { Box, HStack } from "@chakra-ui/react";
import Button from "../../DSL/Button/Button";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import { RGBEEncoding, sRGBEncoding } from "three/src/constants";
import Icon from "../../DSL/Icon/Icon";

interface ThreeSceneProps {
  onPixelSelect: (x: number, y: number, index: THREE.Vector3) => void;
}

const ThreeScene = React.memo(({ onPixelSelect }: ThreeSceneProps) => {
  const cam = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.0000001, 10000);
  const [camera] = useState<THREE.PerspectiveCamera>(cam);

  const canvasParentRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      const width = node.clientWidth;
      const height = node.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
    }
  }, []);

  const texture = useLoader(THREE.TextureLoader, KobosuImage);
  texture.magFilter = THREE.NearestFilter;
  const scale = 480;
  const aspectRatio = texture.image.width / texture.image.height;
  const imageWorldUnitsWidth = aspectRatio * scale;
  const imageWorldUnitsHeight = scale;
  const imageWorldUnitsArea = imageWorldUnitsWidth * imageWorldUnitsHeight;

  const worldUnitsPixelArea = imageWorldUnitsArea / (texture.image.width * texture.image.height);
  const worldUnitPixelLength = Math.sqrt(worldUnitsPixelArea);

  const [boundingBox, setBoundingBox] = useState<Box3 | null>(null);
  const [overlayLength] = useState<number>(worldUnitPixelLength);

  const overlayRef = useRef<Object3D>(null);
  const imageMeshRef = useCallback(node => {
    if (node) {
      const box = new THREE.Box3().setFromObject(node);
      setBoundingBox(box);
    }
  }, []);

  camera.position.x = imageWorldUnitsWidth / 2 - 0.65;
  camera.position.y = imageWorldUnitsHeight / 2 + 0.26;
  camera.position.z = 6000;

  const onDocumentMouseWheel = useCallback((event: Event) => {
    event.preventDefault();
    const { deltaY } = event as WheelEvent;
    const maxCameraZ = 6000;
    const minCameraZ = 80;
    const newZ = camera.position.z + deltaY;
    if (newZ >= minCameraZ && newZ <= maxCameraZ) {
      camera.position.z = newZ;
    }
  }, []);

  const runOnUnmount: any[] = [];
  let isDragging = false;

  const canvasRef = useCallback((node: HTMLCanvasElement) => {
    if (node) {
      console.log("debug:: CANVAS REF CALL");
      let isDown = false;
      let startMouseX: number;
      let startMouseY: number;

      const downListener = (event: MouseEvent) => {
        isDown = true;
        startMouseX = event.clientX;
        startMouseY = event.clientY;
      };
      const upListener = (event: MouseEvent) => {
        isDown = false;
        if (isDragging) {
          // console.log("debug::IS DRAGGING")
          isDragging = false;
        } else {
          // console.log("debug::is not dragging")
        }
        // console.log("debug:: test call")
        node.style.cursor = "pointer";
      };
      const moveListener = (event: MouseEvent) => {
        const deltaX = 3;
        const deltaY = 3;
        const mouseXNow = event.clientX;
        const mouseYNow = event.clientY;

        const diffX = startMouseX - mouseXNow;
        const diffY = startMouseY - mouseYNow;

        const sensitivityFactor = camera.position.z / 25000;

        if (isDown) {
          if (Math.abs(diffX) >= deltaX) {
            isDragging = true;
            camera.position.x += diffX * sensitivityFactor;
            startMouseX = mouseXNow;
          }

          if (Math.abs(diffY) >= deltaY) {
            isDragging = true;
            camera.position.y -= diffY * sensitivityFactor;
            startMouseY = mouseYNow;
          }
          node.style.cursor = "grabbing";
        }
      };
      const mouseEnterListener = (event: Event) => {
        node.style.cursor = "pointer";
      };

      node.addEventListener("wheel", onDocumentMouseWheel, false);
      node.addEventListener("mousedown", downListener, false);
      node.addEventListener("mousemove", moveListener, false);
      node.addEventListener("mouseup", upListener, false);
      node.addEventListener("mouseenter", upListener, false);

      const removeScrollListener = () => node.removeEventListener("wheel", onDocumentMouseWheel);
      const removeDownListener = () => node.removeEventListener("mousedown", downListener);
      const removeMoveListener = () => node.removeEventListener("mousemove", moveListener);
      const removeUpListener = () => node.removeEventListener("mouseup", upListener);
      const removeEnterListener = () => node.removeEventListener("mouseup", mouseEnterListener);

      runOnUnmount.push(removeScrollListener);
      runOnUnmount.push(removeDownListener);
      runOnUnmount.push(removeMoveListener);
      runOnUnmount.push(removeUpListener);
      runOnUnmount.push(removeEnterListener);
    }
  }, []);

  useEffect(() => {
    console.log("debug:: three scene useEffect");

    return () => {
      runOnUnmount.forEach(fn => {
        console.log("running cleanup::", fn.name);
        fn();
      });
    };
  }, []);

  let isOverlayMovable = true;
  // const [isOverlayMovable, setIsOverlayMovable] = useState(true)

  const getPixelIndex = (point: number, length: number) => {
    return Math.round(point - 0.5) / length + length / 2;
  };

  return (
    <Box ref={canvasParentRef} position={"relative"} w={"100%"} h={"100%"}>
      <Canvas
        ref={canvasRef}
        camera={camera}
        onCreated={({ gl }) => {
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <mesh
          ref={imageMeshRef}
          position={[imageWorldUnitsWidth / 2, imageWorldUnitsHeight / 2, 0]}
          onPointerMove={e => {
            const { point } = e;
            if (overlayRef.current && isOverlayMovable) {
              const overlayX = getPixelIndex(point.x, overlayLength);
              const overlayY = getPixelIndex(point.y, overlayLength);
              overlayRef.current.position.x = overlayX;
              overlayRef.current.position.y = overlayY;
            }
          }}
          onClick={e => {
            if (!isDragging) {
              isOverlayMovable = false;
              const { point } = e;
              const pixelX = getPixelIndex(point.x, overlayLength);
              const pixelY = getPixelIndex(point.y, overlayLength);
              const indexX = Math.floor(pixelX + overlayLength);
              const indexY = Math.floor(pixelY + overlayLength);
              onPixelSelect(indexX, indexY, point);
            }
          }}
        >
          <planeGeometry attach={"geometry"} args={[imageWorldUnitsWidth, imageWorldUnitsHeight]} />
          <meshBasicMaterial attach={"material"} map={texture} />
        </mesh>
        <mesh ref={overlayRef} position={[0, 0, 0.0001]}>
          <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]} />
          <meshBasicMaterial attach={"material"} color={0xff0000} opacity={0.5} transparent={true} />
        </mesh>
      </Canvas>
      <Button position={"absolute"} left={2} top={2}>
        <Icon icon={"close"} onClick={() => (isOverlayMovable = true)} />
      </Button>
    </Box>
  );
});

export default ThreeScene;
