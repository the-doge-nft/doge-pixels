import React, {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import { Object3D } from "three";
import { Canvas, useLoader, Vector2 } from "@react-three/fiber";
import KobosuImage from "../../images/kobosu.jpeg";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png"
import { Box } from "@chakra-ui/react";
import { getWorldPixelCoordinate } from "./helpers";
import { onPixelSelectType } from "./Viewer.page";
import ViewerStore from "./Viewer.store";
import { SET_CAMERA } from "../../services/mixins/eventable";
import { BigNumber } from "ethers";

interface ThreeSceneProps {
  onPixelSelect: onPixelSelectType;
  selectedPixel: any;
  store?: ViewerStore;
}

const ThreeScene = React.memo(({ onPixelSelect, selectedPixel, store }: ThreeSceneProps) => {
  const cam = new THREE.PerspectiveCamera(5, window.innerWidth / window.innerHeight, 0.0000001, 10000);
  const [camera] = useState<THREE.PerspectiveCamera>(cam);

  //@TODO: CC FIX
  const aDiffRef = useRef<HTMLDivElement | null>(null)

  const canvasParentRef = useCallback((node: HTMLDivElement) => {
    if (node) {
      const width = node.clientWidth;
      const height = node.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      camera.position.x = imageWorldUnitsWidth / 2 - 0.65;
      camera.position.y = -1*imageWorldUnitsHeight / 2 + 0.26;
      camera.position.z = 6000;

      aDiffRef.current = node
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

  const maxCameraZ = 6000;
  const minCameraZ = 80;

  const onDocumentMouseWheel = (event: Event) => {
    event.preventDefault();
    const { deltaY } = event as WheelEvent;
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
      onPixelSelect(indexX, -1*indexY);

      if (selectedPixelOverlayRef.current) {
        selectedPixelOverlayRef.current.visible = true;
        [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [pixelX, pixelY];
        selectedPixelOverlayRef.current.position.z = 0.001;
      }
    }
  };

  useEffect(() => {
    if (store?.selectedPupper) {
      console.log("blah")
    } else {
      if (selectedPixelOverlayRef.current) {
        selectedPixelOverlayRef.current.visible = false;
      }
    }
  }, [store?.selectedPupper])

  const setCam = useCallback((data) => {

  }, [])


  useEffect(() => {
    const CameraTools = {
      setCamera: ([x, y]: [BigNumber, BigNumber]) => {
        const xPos = x.toNumber()
        const yPos = -1*y.toNumber()

        camera.position.x = xPos - 0.5
        camera.position.y = yPos - 0.5
        camera.position.z = minCameraZ

        if (selectedPixelOverlayRef.current) {
          selectedPixelOverlayRef.current.visible = true;
          [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [
            xPos - (overlayLength/2),
            yPos - (overlayLength/2)
          ];
          selectedPixelOverlayRef.current.position.z = 0.001;
        }
      }
    }
    store?.subscribe(SET_CAMERA, CameraTools, "setCamera")
    return () => {
      store?.unsubscribeAllFrom(CameraTools)
    }
  }, [])

  return (
    <Box ref={canvasParentRef} position={"absolute"} w={"100%"} h={"100%"}>
      <Canvas
        camera={camera}
        onCreated={({ gl }) => {
          window.addEventListener("resize", () => {
            if (aDiffRef.current) {
              const width = aDiffRef.current.clientWidth;
              const height = aDiffRef.current.clientHeight;
              camera.aspect = width / height;
              gl.setSize( width, height );
              camera.updateProjectionMatrix();
            }
          })

          gl.domElement.addEventListener("wheel", e => onDocumentMouseWheel(e));
          gl.domElement.addEventListener("mousedown", e => downListener(e));
          gl.domElement.addEventListener("mousemove", e => moveListener(e, gl.domElement));
          gl.domElement.addEventListener("mouseup", e => upListener(e, gl.domElement));
          gl.domElement.addEventListener("mouseenter", e => mouseEnterListener(e, gl.domElement));
          gl.toneMapping = THREE.NoToneMapping;
        }}
      >
        <mesh
          position={[(imageWorldUnitsWidth / 2) - 1, -1*imageWorldUnitsHeight / 2, 0]}
          onPointerMove={e => {
            if (hoverPixelOverlayRef.current) {
              [hoverPixelOverlayRef.current.position.x, hoverPixelOverlayRef.current.position.y] =
                getWorldPixelCoordinate(e.point, overlayLength);
              hoverPixelOverlayRef.current.position.z = 0.0001;
            }

            if (newHoverOverlayRef.current) {
              [newHoverOverlayRef.current.position.x, newHoverOverlayRef.current.position.y] =
                getWorldPixelCoordinate(e.point, overlayLength);
              newHoverOverlayRef.current.position.z = 0.001;
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

        <group ref={newHoverOverlayRef}>
          <mesh position={[-0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} />
          </mesh>
          <mesh position={[0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} />
          </mesh>
          <mesh position={[0, 0.5, 0.001]} rotation={new THREE.Euler(0, 0, Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} />
          </mesh>
          <mesh position={[0, -0.5, 0.001]} rotation={new THREE.Euler(0, 0, -Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]} />
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} />
          </mesh>
        </group>
      </Canvas>
    </Box>
  );
});


export default ThreeScene;
