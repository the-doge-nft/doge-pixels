import React, {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {Object3D} from "three";
import {Canvas, useLoader} from "@react-three/fiber";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png";
import {Box} from "@chakra-ui/react";
import {getWorldPixelCoordinate} from "./helpers";
import {onPixelSelectType} from "./Viewer.page";
import ViewerStore from "./Viewer.store";
import {SET_CAMERA} from "../../services/mixins/eventable";
import Button, {ButtonVariant} from "../../DSL/Button/Button";
import createPanZoom from "../../services/three-map-js";
import { useQuery } from "../../helpers/hooks";

interface ThreeSceneProps {
  onPixelSelect: onPixelSelectType;
  store?: ViewerStore;
}

const ThreeScene = React.memo(({onPixelSelect, store}: ThreeSceneProps) => {
  const query = useQuery()
  const maxCameraZ = 5500;
  const minCameraZ = 80;
  const _zClippingSafetyBuffer = 3

  var panZoom: any
  useEffect(() => {
    panZoom?.dispose()
  }, [])

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
      camera.position.y = -1 * imageWorldUnitsHeight / 2 + 0.26;
      camera.position.z = maxCameraZ;

      canvasContainerRef.current = node
      node.focus()
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

  const onPointUp = (e: any) => {
    if (!isDragging) {
      const [pixelX, pixelY] = getWorldPixelCoordinate(e.point, overlayLength);
      const indexX = Math.floor(pixelX + overlayLength);
      const indexY = Math.floor(pixelY + overlayLength);
      onPixelSelect(indexX, -1 * indexY);

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

  const CameraTools = {
    setCamera: ([x, y]: [number, number]) => {
      const xPos = x
      const yPos = -1 * y

      camera.position.x = xPos - (overlayLength / 2)
      camera.position.y = yPos - (overlayLength / 2)

      if (camera.position.z === maxCameraZ) {
        camera.position.z = (maxCameraZ - minCameraZ) / 2
      }

      if (selectedPixelOverlayRef.current) {
        selectedPixelOverlayRef.current.visible = true;
        [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [
          xPos - (overlayLength / 2),
          yPos - (overlayLength / 2)
        ];
      }
    }
  }

  // click select pixel & jump to location
  useEffect(() => {
    store?.subscribe(SET_CAMERA, CameraTools, "setCamera")
    return () => {
      store?.unsubscribeAllFrom(CameraTools)
    }
  }, [])

  return (
    <Box ref={canvasContainerOnMount} position={"absolute"} w={"100%"} h={"100%"}>
      <Canvas
        camera={camera}
        onCreated={({gl}) => {
          window.addEventListener("resize", () => {
            const width = gl.domElement.parentElement!.clientWidth;
            const height = gl.domElement.parentElement!.clientHeight;
            camera.aspect = width / height;
            gl.setSize(width, height);
            camera.updateProjectionMatrix();
          })
          gl.toneMapping = THREE.NoToneMapping;

          if (dogeMeshRef.current) {
            //@TODO: CC add type declaration
            panZoom = createPanZoom(camera, gl.domElement.parentElement, dogeMeshRef.current, minCameraZ, maxCameraZ);
            //@ts-ignore
            panZoom.on('panstart', function () {
              setIsDragging(true)
            });

            //@ts-ignore
            panZoom.on('panend', function () {
              setIsDragging(false)
            });
          }

          const x = query.get("x")
          const y = query.get("y")
          if (x !== null && y !== null) {
            CameraTools.setCamera([Number(x), Number(y)])
          }
        }}
      >
        <mesh
          ref={dogeMeshRef}
          position={[(imageWorldUnitsWidth / 2) - 1, -1 * imageWorldUnitsHeight / 2, 0]}
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
        >
          <planeGeometry attach={"geometry"} args={[imageWorldUnitsWidth, imageWorldUnitsHeight]}/>
          <meshBasicMaterial attach={"material"} map={texture} depthTest={false}/>
        </mesh>

        <mesh ref={selectedPixelOverlayRef} position={[0, 0, 0.0001]} visible={false}>
          <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]}/>
          <meshBasicMaterial attach={"material"} color={0xff0000} opacity={0.8} transparent={true} depthTest={false}/>
        </mesh>

        <group ref={newHoverOverlayRef}>
          <mesh position={[-0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]}/>
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]}/>
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0, 0.5, 0.001]} rotation={new THREE.Euler(0, 0, Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]}/>
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0, -0.5, 0.001]} rotation={new THREE.Euler(0, 0, -Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]}/>
            <meshBasicMaterial attach={"material"} color={0xf1c232} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
        </group>
      </Canvas>
      <Box position={"absolute"} bottom={0} left={0}>
        <Button size={"sm"}
                variant={ButtonVariant.Text}
                onClick={() => camera.position.z = (minCameraZ + maxCameraZ) / 2}>+</Button>
        <Button size={"sm"}
                variant={ButtonVariant.Text}
                onClick={() => camera.position.z = (minCameraZ + maxCameraZ) / 5}>++</Button>
        <Button size={"sm"}
                variant={ButtonVariant.Text}
                onClick={() => camera.position.z = minCameraZ + 50}>+++</Button>
      </Box>
    </Box>
  );
});


export default ThreeScene;
