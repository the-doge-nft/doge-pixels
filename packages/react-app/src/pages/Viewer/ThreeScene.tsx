import React, {useCallback, useEffect, useRef, useState} from "react";
import * as THREE from "three";
import {Object3D, Vector3} from "three";
import {Canvas, useLoader} from "@react-three/fiber";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png";
import KobosuJson from "../../images/kobosu.json"
import {Box, useColorMode} from "@chakra-ui/react";
import {getWorldPixelCoordinate, solveForBounds} from "./helpers";
import {onPixelSelectType} from "./Viewer.page";
import ViewerStore from "./Viewer.store";
import {SET_CAMERA} from "../../services/mixins/eventable";
import Button, {ButtonVariant} from "../../DSL/Button/Button";
import createPanZoom from "../../services/three-map-js";
import { useQuery } from "../../helpers/hooks";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import AppStore from "../../store/App.store";
import {observer} from "mobx-react-lite";

interface ThreeSceneProps {
  onPixelSelect: onPixelSelectType;
  store?: ViewerStore;
}

export enum CameraPositionZ {
  far = 4800,
  medium = 300,
  close = 80
}

export const IMAGE_WIDTH = 640
export const IMAGE_HEIGHT = 480

const ThreeScene = observer(({onPixelSelect, store}: ThreeSceneProps) => {
  const query = useQuery()
  const zClippingSafetyBuffer = 3

  const cam = new THREE.PerspectiveCamera(
    5,
    window.innerWidth / window.innerHeight,
    CameraPositionZ.close - zClippingSafetyBuffer,
    CameraPositionZ.far + zClippingSafetyBuffer
  );

  const [camera] = useState<THREE.PerspectiveCamera>(cam);
  const [isDragging, setIsDragging] = useState(false);
  const {colorMode} = useColorMode()

  const canvasContainerRef = useRef<HTMLDivElement | null>(null)
  const dogeMeshRef = useRef<Object3D | null>(null)
  const selectedPixelOverlayRef = useRef<Object3D>(null);
  const hoverOverlayRef = useRef<Object3D>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  const selectedColor = colorMode === "light" ? 0xff0000 : 0xff00e5
  const hoverColor = colorMode === "light" ? 0xf1c232 : 0x6E1DEC

  //@TODO: CC connect type
  var panZoom: any
  useEffect(() => {
    panZoom?.dispose()
  // eslint-disable-next-line
  }, [])

  const canvasContainerOnMount = useCallback((node: HTMLDivElement) => {
    if (node) {
      const width = node.clientWidth;
      const height = node.clientHeight;
      camera.aspect = width / height;
      camera.updateProjectionMatrix();

      camera.position.x = imageWorldUnitsWidth / 2 - 0.65;
      camera.position.y = (-1 * imageWorldUnitsHeight / 2) + 20;
      camera.position.z = CameraPositionZ.far;

      canvasContainerRef.current = node
      node.focus()
    }
    // eslint-disable-next-line
  }, []);

  const texture = useLoader(THREE.TextureLoader, Kobosu);
  texture.magFilter = THREE.NearestFilter;
  // avoid texture resizing to power of 2
  // https://stackoverflow.com/questions/55175351/remove-texture-has-been-resized-console-logs-in-three-js
  texture.minFilter = THREE.LinearFilter;
  const scale = 480;
  const aspectRatio = texture.image.width / texture.image.height;
  const imageWorldUnitsWidth = aspectRatio * scale;
  const imageWorldUnitsHeight = scale;
  const imageWorldUnitsArea = imageWorldUnitsWidth * imageWorldUnitsHeight;
  const worldUnitsPixelArea = imageWorldUnitsArea / (texture.image.width * texture.image.height);
  const overlayLength = Math.sqrt(worldUnitsPixelArea);

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
    setCamera: ([x, y, z]: [number, number, number?]) => {
      const xPos = x
      const yPos = -1 * y

      const futureX = xPos - (overlayLength / 2)
      const futureY = yPos - (overlayLength / 2)
      let futureZ = CameraPositionZ.close

      if (z !== undefined) {
        futureZ = z
      }

      const toBe = new Vector3(
        futureX,
        futureY,
        futureZ
      )
      const [_x, _y, _z] = solveForBounds(toBe, camera.fov, camera.aspect, dogeMeshRef.current!.position.z)

      console.log("debug:: x y z", _x, _y, _z)

      camera.position.x = futureX
      camera.position.y = futureY
      camera.position.z = futureZ


      if (selectedPixelOverlayRef.current) {
        selectedPixelOverlayRef.current.visible = true;
        [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [
          xPos - (overlayLength / 2),
          yPos - (overlayLength / 2)
        ];
      }
    }
  }

  useEffect(() => {
    store?.subscribe(SET_CAMERA, CameraTools, "setCamera")
    return () => {
      store?.unsubscribeAllFrom(CameraTools)
    }
    // eslint-disable-next-line
  }, [])

  return (
    <Box ref={canvasContainerOnMount}
         w={"100%"}
         h={"100%"}
         position={"absolute"}
         zIndex={2}
         _focus={{boxShadow: "none", borderColor: "inherit"}}
    >
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
            panZoom = createPanZoom(
              camera,
              gl.domElement.parentElement,
              dogeMeshRef.current,
              CameraPositionZ.close,
              CameraPositionZ.far,
            );
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
            if (hoverOverlayRef.current) {
              [hoverOverlayRef.current.position.x, hoverOverlayRef.current.position.y] =
                getWorldPixelCoordinate(e.point, overlayLength);
            }

            if (tooltipRef.current) {
              const {pageX, pageY} = e
              const box = tooltipRef.current?.getBoundingClientRect()
              const canvas = e.srcElement as HTMLCanvasElement
              const {left: canvasLeft, top: canvasTop} = canvas.getBoundingClientRect()
              const tooltipOffset = 45

              const x = pageX - canvasLeft + tooltipOffset
              tooltipRef.current.style.left = x+"px"

              const y = pageY - canvasTop + tooltipOffset
              const futureY = y + box.height
              if ((futureY) < window.innerHeight - canvasTop) {
                tooltipRef.current.style.top = y+"px"
              }

              // BEWARE: below dom manipulations are heavily dependent upon the structure of <PixelPane/>
              const firstChild = tooltipRef.current?.children[0]
              const firstGrandchild = firstChild?.children[0] as HTMLDivElement
              const secondGrandchild = firstChild?.children[1] as HTMLDivElement
              const firstGreatGrandChild = secondGrandchild?.children[0] as HTMLDivElement
              const [pixelX, pixelY] = getWorldPixelCoordinate(e.point, overlayLength);
              const indexX = Math.floor(pixelX + overlayLength);
              const indexY = -1*Math.floor(pixelY + overlayLength);

              //@ts-ignore
              const hex = KobosuJson[indexY][indexX]
              firstGrandchild.style.background = hex
              firstGreatGrandChild.innerText = `(${indexX},${indexY})`
            }
          }}
          onPointerLeave={(e) => {
            if (tooltipRef.current) {
              tooltipRef.current.style.display = "none"
            }
          }}
          onPointerEnter={(e) => {
            if (tooltipRef.current) {
              tooltipRef.current.style.display = "block"
            }
          }}
          onPointerUp={onPointUp}
        >
          <planeGeometry attach={"geometry"} args={[imageWorldUnitsWidth, imageWorldUnitsHeight]}/>
          <meshBasicMaterial attach={"material"} map={texture} depthTest={false}/>
        </mesh>

        <mesh ref={selectedPixelOverlayRef} position={[0, 0, 0.0001]} visible={false}>
          <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]}/>
          <meshBasicMaterial attach={"material"} color={selectedColor} opacity={0.8} transparent={true} depthTest={false}/>
        </mesh>

        {!AppStore.rwd.isMobile && <group ref={hoverOverlayRef}>
          <mesh position={[-0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]}/>
            <meshBasicMaterial attach={"material"} color={hoverColor} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0.5, 0, 0.001]}>
            <planeGeometry attach={"geometry"} args={[0.05, 1.05]}/>
            <meshBasicMaterial attach={"material"} color={hoverColor} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0, 0.5, 0.001]} rotation={new THREE.Euler(0, 0, Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]}/>
            <meshBasicMaterial attach={"material"} color={hoverColor} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
          <mesh position={[0, -0.5, 0.001]} rotation={new THREE.Euler(0, 0, -Math.PI / 2)}>
            <planeGeometry attach={"geometry"} args={[0.05, 1]}/>
            <meshBasicMaterial attach={"material"} color={hoverColor} opacity={1} transparent={true} depthTest={false}/>
          </mesh>
        </group>}
      </Canvas>
      {!AppStore.rwd.isMobile &&
      <Box ref={tooltipRef} position={"absolute"} zIndex={2} display={"none"} pointerEvents={"none"}>
        <PixelPane size={"md"} pupper={0} color={"fff"} pupperIndex={0}/>
      </Box>}
      <Box position={"absolute"} bottom={0} left={0}>
        <Button size={"sm"}
                variant={ButtonVariant.Text}
                onClick={() => camera.position.z = (CameraPositionZ.close + CameraPositionZ.far) / 2}>+</Button>
        <Button size={"sm"}
                variant={ButtonVariant.Text}
                onClick={() => camera.position.z = (CameraPositionZ.close + CameraPositionZ.far) / 5}>++</Button>
        <Button size={"sm"}
                variant={ButtonVariant.Text}
                onClick={() => camera.position.z = CameraPositionZ.close + 50}>+++</Button>
      </Box>
    </Box>
  );
});


export default ThreeScene;
