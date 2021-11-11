import React, { useCallback, useRef, useState } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import KobosuImage from "../../images/kobosu.jpeg";
import { Box } from "@chakra-ui/react";
import Button from "../../DSL/Button/Button";
import Icon from "../../DSL/Icon/Icon";
import { getWorldPixelCoordinate } from "./helpers";
import { onPixelSelectType } from "./Viewer.page";

interface ThreeSceneProps {
  onPixelSelect: onPixelSelectType;
  onPixelClear: () => void;
}

const ThreeScene = React.memo(({ onPixelSelect, onPixelClear }: ThreeSceneProps) => {
  const cam = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.0000001, 10000);
  const [camera] = useState<THREE.PerspectiveCamera>(cam);

  const canvasParentRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      const width = node.clientWidth;
      const height = node.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      camera.position.x = imageWorldUnitsWidth / 2 - 0.65;
      camera.position.y = imageWorldUnitsHeight / 2 + 0.26;
      camera.position.z = 6000;
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

  const [overlayLength] = useState<number>(worldUnitPixelLength);
  const selectedPixelOverlayRef = useRef<Object3D>(null);
  const hoverPixelOverlayRef = useRef<Object3D>(null);
  const [isDragging, setIsDragging] = useState(false);

  let isDown = false;
  let startMouseX: number;
  let startMouseY: number;

  const onDocumentMouseWheel = (event: Event) => {
    event.preventDefault();
    const { deltaY } = event as WheelEvent;
    const maxCameraZ = 6000;
    const minCameraZ = 80;
    const newZ = camera.position.z + deltaY;
    if (newZ >= minCameraZ && newZ <= maxCameraZ) {
      camera.position.z = newZ;
    }
  };

  const downListener = (event: MouseEvent) => {
    isDown = true;
    startMouseX = event.clientX;
    startMouseY = event.clientY;
  };

  const upListener = (event: MouseEvent, node: HTMLCanvasElement) => {
    isDown = false;
    setIsDragging(false);
    node.style.cursor = "pointer";
  };

  const moveListener = (event: MouseEvent, node: HTMLCanvasElement) => {
    const deltaX = 3;
    const deltaY = 3;
    const mouseXNow = event.clientX;
    const mouseYNow = event.clientY;
    const diffX = startMouseX - mouseXNow;
    const diffY = startMouseY - mouseYNow;
    const sensitivityFactor = camera.position.z / 13000;

    if (isDown) {
      if (Math.abs(diffX) >= deltaX) {
        setIsDragging(true);
        camera.position.x += diffX * sensitivityFactor;
        startMouseX = mouseXNow;
      }

      if (Math.abs(diffY) >= deltaY) {
        setIsDragging(true);
        camera.position.y -= diffY * sensitivityFactor;
        startMouseY = mouseYNow;
      }
      node.style.cursor = "grabbing";
    }
  };
  const mouseEnterListener = (event: Event, node: HTMLCanvasElement) => {
    node.style.cursor = "pointer";
  };

  const onPointUp = (e: any) => {
    if (!isDragging) {
      const [pixelX, pixelY] = getWorldPixelCoordinate(e.point, overlayLength);
      const indexX = Math.floor(pixelX + overlayLength);
      const indexY = Math.floor(pixelY + overlayLength);
      onPixelSelect(indexX, indexY, e.point);

      if (selectedPixelOverlayRef.current) {
        selectedPixelOverlayRef.current.visible = true;
        [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [pixelX, pixelY];
        selectedPixelOverlayRef.current.position.z = 0.0001;
      }
    }
  };

  return (
    <Box ref={canvasParentRef} position={"relative"} w={"100%"} h={"100%"}>
      <Canvas
        camera={camera}
        onCreated={({ gl }) => {
          gl.domElement.addEventListener("wheel", e => onDocumentMouseWheel(e));
          gl.domElement.addEventListener("mousedown", e => downListener(e));
          gl.domElement.addEventListener("mousemove", e => moveListener(e, gl.domElement));
          gl.domElement.addEventListener("mouseup", e => upListener(e, gl.domElement));
          gl.domElement.addEventListener("mouseenter", e => mouseEnterListener(e, gl.domElement));
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <mesh
          position={[imageWorldUnitsWidth / 2, imageWorldUnitsHeight / 2, 0]}
          onPointerMove={e => {
            if (hoverPixelOverlayRef.current) {
              [hoverPixelOverlayRef.current.position.x, hoverPixelOverlayRef.current.position.y] =
                getWorldPixelCoordinate(e.point, overlayLength);
              hoverPixelOverlayRef.current.position.z = 0.0001;
            }
          }}
          onPointerUp={onPointUp}
        >
          <planeGeometry attach={"geometry"} args={[imageWorldUnitsWidth, imageWorldUnitsHeight]} />
          <meshBasicMaterial attach={"material"} map={texture} />
        </mesh>
        <mesh ref={selectedPixelOverlayRef} position={[0, 0, 0.0001]}>
          <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]} />
          <meshBasicMaterial attach={"material"} color={0xff00ff} opacity={0.8} transparent={true} />
        </mesh>
        <mesh ref={hoverPixelOverlayRef} position={[0, 0, 0.0001]}>
          <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]} />
          {/* @TODO mesh lines here instead so we can control width */}
          <meshBasicMaterial
            wireframe={true}
            wireframeLinewidth={10}
            attach={"material"}
            color={0xffff00}
            opacity={0.5}
            transparent={true}
          />
        </mesh>
      </Canvas>
      <Button
        position={"absolute"}
        left={2}
        top={2}
        onClick={() => {
          onPixelClear();
          if (selectedPixelOverlayRef.current) {
            selectedPixelOverlayRef.current.visible = false;
          }
        }}
      >
        <Icon icon={"close"} />
      </Button>
    </Box>
  );
});

export default ThreeScene;
