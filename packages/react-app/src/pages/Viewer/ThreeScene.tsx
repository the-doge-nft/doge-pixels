import React, { useCallback, useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png";
import { Box } from "@chakra-ui/react";
import { getWorldPixelCoordinate } from "./helpers";
import { onPixelSelectType } from "./Viewer.page";
import ViewerStore from "./Viewer.store";
import { SET_CAMERA } from "../../services/mixins/eventable";
import { BigNumber } from "ethers";
import Button, { ButtonVariant } from "../../DSL/Button/Button";

interface ThreeSceneProps {
  onPixelSelect: onPixelSelectType;
  selectedPixel: any;
  store?: ViewerStore;
}

const ThreeScene = React.memo(({ onPixelSelect, selectedPixel, store }: ThreeSceneProps) => {
  const maxCameraZ = 5500;
  const minCameraZ = 80;
  const _zClippingSafetyBuffer = 10

  const cam = new THREE.PerspectiveCamera(
    5,
    window.innerWidth / window.innerHeight,
    minCameraZ - _zClippingSafetyBuffer,
    maxCameraZ + _zClippingSafetyBuffer
  );
  const [camera] = useState<THREE.PerspectiveCamera>(cam);

  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
  const dogeMeshRef = useRef<Object3D | null>(null)

  const canvasContainerOnMount = useCallback((node: HTMLDivElement) => {
    if (node) {
      const width = node.clientWidth;
      const height = node.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      camera.position.x = imageWorldUnitsWidth / 2 - 0.65;
      camera.position.y = -1*imageWorldUnitsHeight / 2 + 0.26;
      camera.position.z = maxCameraZ;

      canvasContainerRef.current = node
    }
  }, []);


  const texture = useLoader(THREE.TextureLoader, Kobosu);
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

  const newHoverOverlayRef = useRef<Object3D>(null)

  let isDown = false;
  let startMouseX: number;
  let startMouseY: number;


  const getVisibleRange = () => {
    if (dogeMeshRef.current) {
      var distance = camera.position.distanceTo( dogeMeshRef.current.position );
      var vFOV = THREE.MathUtils.degToRad( camera.fov );
      var height = 2 * Math.tan( vFOV / 2 ) * distance;
      var width = height * camera.aspect;

      const x1 = camera.position.x - (width/2)
      const x2 = camera.position.x + (width/2)
      const y1 = camera.position.y - (height/2)
      const y2 = camera.position.y + (height/2)

      return [x1, x2, y1, y2]
    }
    return [0,0,0,0]
  }

  const getVisibleBoundaries = () => {
    const boundaryBuffer = 5
    const x1Bound = 0
    const x2Bound = 640
    const y1Bound = -480
    const y2Bound = 0
    const [x1, x2, y1, y2] = getVisibleRange()

    return {
      leftBoundaryHit: (x1 < (x1Bound - boundaryBuffer)),
      rightBoundaryHit: (x2 > (x2Bound + boundaryBuffer)),
      topBoundaryHit: (y2 > (y2Bound + boundaryBuffer)),
      bottomBoundaryHit: (y1 < (y1Bound - boundaryBuffer))
    }
  }

  const isDogeInVisibleBounds = () => {
    const boundariesHit = getVisibleBoundaries()
    if (
      boundariesHit.leftBoundaryHit
      || boundariesHit.rightBoundaryHit
      || boundariesHit.topBoundaryHit
      || boundariesHit.bottomBoundaryHit
    ) {
      return false
    }
    return true
  }

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
    const deltaToMoveX = 3;
    const deltaToMoveY = 3;
    const mouseXNow = event.clientX;
    const mouseYNow = event.clientY;
    const diffX = startMouseX - mouseXNow;
    const diffY = startMouseY - mouseYNow;
    const sensitivityFactor = camera.position.z / 13000;

    const panningLeft = diffX < 0
    const panningRight = diffX > 0
    const panningUp = diffY < 0
    const panningDown = diffY > 0

    if (isDown) {
      const isVisible = isDogeInVisibleBounds()
      const boundaries = getVisibleBoundaries()

      if (Math.abs(diffX) >= deltaToMoveX) {
        if (isVisible || (boundaries.leftBoundaryHit && panningRight || boundaries.rightBoundaryHit && panningLeft)) {
          setIsDragging(true);
          camera.position.x += diffX * sensitivityFactor;
          startMouseX = mouseXNow;
        }
      }

      if (Math.abs(diffY) >= deltaToMoveY) {
        if (isVisible || (boundaries.bottomBoundaryHit && panningUp || boundaries.topBoundaryHit && panningDown)) {
          setIsDragging(true);
          camera.position.y -= diffY * sensitivityFactor;
          startMouseY = mouseYNow;
        }
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
      onPixelSelect(indexX, -1*indexY);

      if (selectedPixelOverlayRef.current) {
        selectedPixelOverlayRef.current.visible = true;
        [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [pixelX, pixelY];
        selectedPixelOverlayRef.current.position.z = 0.001;
      }
    }
  };

  useEffect(() => {
    if (!store?.selectedPupper && selectedPixelOverlayRef.current) {
      selectedPixelOverlayRef.current.visible = false;
    }
  }, [store?.selectedPupper])


  useEffect(() => {
    const CameraTools = {
      setCamera: ([x, y]: [BigNumber, BigNumber]) => {
        const xPos = x.toNumber()
        const yPos = -1*y.toNumber()

        camera.position.x = xPos - (overlayLength / 2)
        camera.position.y = yPos - (overlayLength / 2)
        camera.position.z = minCameraZ

        if (selectedPixelOverlayRef.current) {
          selectedPixelOverlayRef.current.visible = true;
          [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [
            xPos - (overlayLength/2),
            yPos - (overlayLength/2)
          ];
        }
      }
    }
    store?.subscribe(SET_CAMERA, CameraTools, "setCamera")
    return () => {
      store?.unsubscribeAllFrom(CameraTools)
    }
  }, [])

  return (
    <Box ref={canvasContainerOnMount} position={"absolute"} w={"100%"} h={"100%"}>
      <Canvas
        camera={camera}
        onCreated={({ gl }) => {
          window.addEventListener("resize", () => {
            if (canvasContainerRef.current) {
              const width = canvasContainerRef.current.clientWidth;
              const height = canvasContainerRef.current.clientHeight;
              camera.aspect = width / height;
              gl.setSize( width, height );
              camera.updateProjectionMatrix();
            }
          })

          gl.domElement.addEventListener("wheel", e => e.preventDefault());
          gl.domElement.addEventListener("mousedown", e => downListener(e));
          gl.domElement.addEventListener("mousemove", e => moveListener(e, gl.domElement));
          gl.domElement.addEventListener("mouseup", e => upListener(e, gl.domElement));
          gl.domElement.addEventListener("mouseenter", e => mouseEnterListener(e, gl.domElement));
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <mesh
          ref={dogeMeshRef}
          position={[(imageWorldUnitsWidth / 2) - 1, -1*imageWorldUnitsHeight / 2, 0]}
          onPointerMove={e => {
            if (hoverPixelOverlayRef.current) {
              [hoverPixelOverlayRef.current.position.x, hoverPixelOverlayRef.current.position.y] =
                getWorldPixelCoordinate(e.point, overlayLength);
            }

            if (newHoverOverlayRef.current) {
              [newHoverOverlayRef.current.position.x, newHoverOverlayRef.current.position.y] =
                getWorldPixelCoordinate(e.point, overlayLength);
            }
          }}
          onPointerUp={onPointUp}
          onWheel={(event) => {
            // @TODO: implement camera zoom towards mouse position here
            const { deltaY } = event;
            const newZ = camera.position.z + deltaY;
            if (newZ >= minCameraZ && newZ <= maxCameraZ) {
              camera.position.z = newZ;
              camera.updateProjectionMatrix();
            }
            getVisibleRange()
          }}
        >
          <planeGeometry attach={"geometry"} args={[imageWorldUnitsWidth, imageWorldUnitsHeight]} />
          <meshBasicMaterial attach={"material"} map={texture} depthTest={false}/>
        </mesh>

        <mesh ref={selectedPixelOverlayRef} position={[0, 0, 0.0001]} visible={false}>
          <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]} />
          <meshBasicMaterial attach={"material"} color={0xff00ff} opacity={0.8} transparent={true} depthTest={false}/>
        </mesh>

        <group ref={newHoverOverlayRef}>
          <mesh position={[-0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0, 0.5, 0.001]} rotation={new THREE.Euler(0, 0, Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0, -0.5, 0.001]} rotation={new THREE.Euler(0, 0, -Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
        </group>
      </Canvas>
      <Box position={"absolute"} bottom={0} left={0}>
        <Button size={"sm"} variant={ButtonVariant.Text} onClick={() => camera.position.z = maxCameraZ}>+</Button>
        <Button size={"sm"} variant={ButtonVariant.Text} onClick={() => camera.position.z = (minCameraZ + maxCameraZ) / 2}>++</Button>
        <Button size={"sm"} variant={ButtonVariant.Text} onClick={() => camera.position.z = minCameraZ + 50}>+++</Button>
      </Box>
    </Box>
  );
});


export default ThreeScene;
