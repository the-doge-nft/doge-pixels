import React, { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Object3D } from "three";
import { Canvas, useLoader } from "@react-three/fiber";
import Kobosu from "../../images/THE_ACTUAL_NFT_IMAGE.png";
import { Box, Flex, Input, useColorMode } from "@chakra-ui/react";
import { createCanvasPixelSelectionSetter, getWorldPixelCoordinate, resizeCanvas } from "./helpers";
import ViewerStore from "./Viewer.store";
import { SELECT_PIXEL } from "../../services/mixins/eventable";
import Button, { ButtonVariant } from "../../DSL/Button/Button";
import createPanZoom, { PanZoomReturn } from "../../services/three-map-js";
import PixelPane from "../../DSL/PixelPane/PixelPane";
import AppStore from "../../store/App.store";
import { observer } from "mobx-react-lite";
import Colors from "../../DSL/Colors/Colors";
import Typography, { TVariant } from "../../DSL/Typography/Typography";
import Icon from "../../DSL/Icon/Icon";

interface ThreeSceneProps {
  store?: ViewerStore;
}

export enum CameraPositionZ {
  far = 4200,
  medium = 300,
  close = 80,
}

export const IMAGE_WIDTH = 640;
export const IMAGE_HEIGHT = 480;

const DogeExplorer = observer(({ store }: ThreeSceneProps) => {
  const { colorMode } = useColorMode();
  //@ts-ignore
  const selectedPixelColor = colorMode === "light" ? Colors["red"]["50"] : Colors["magenta"]["50"];
  //@ts-ignore
  const hoveredPixelColor = colorMode === "light" ? Colors["yellow"]["700"] : Colors["purple"]["100"];
  // todo: better color here
  //@ts-ignore
  const ownedPixelColor = colorMode === "light" ? Colors["blue"]["50"] : Colors["blue"]["100"];

  // state for showing all owned tokens
  const [showOwned, setShowOwned] = useState(false);

  // Setup refs to canvas elements
  const dogeMeshRef = useRef<Object3D | null>(null);
  const selectedPixelOverlayRef = useRef<Object3D>(null);
  const hoverOverlayRef = useRef<Object3D>(null);
  const tooltipRef = useRef<HTMLDivElement | null>(null);

  // Load texture & init some vars
  const texture = useLoader(THREE.TextureLoader, Kobosu);
  texture.magFilter = THREE.NearestFilter;
  // avoid texture resizing to power of 2
  // https://stackoverflow.com/questions/55175351/remove-texture-has-been-resized-console-logs-in-three-js
  texture.minFilter = THREE.LinearFilter;
  const scale = IMAGE_HEIGHT;
  const aspectRatio = texture.image.width / texture.image.height;
  const imageWorldUnitsWidth = aspectRatio * scale;
  const imageWorldUnitsHeight = scale;
  const imageWorldUnitsArea = imageWorldUnitsWidth * imageWorldUnitsHeight;
  const worldUnitsPixelArea = imageWorldUnitsArea / (texture.image.width * texture.image.height);
  const overlayLength = Math.sqrt(worldUnitsPixelArea);

  // Create camera
  const zClippingSafetyBuffer = 3;
  const cam = new THREE.PerspectiveCamera(
    5,
    window.innerWidth / window.innerHeight,
    CameraPositionZ.close - zClippingSafetyBuffer,
    CameraPositionZ.far + zClippingSafetyBuffer,
  );
  const [camera] = useState<THREE.PerspectiveCamera>(cam);

  // Init panZoom camera controls
  var panZoom: PanZoomReturn;
  useEffect(() => {
    panZoom?.dispose();
    // eslint-disable-next-line
  }, []);

  // Create canvas pixel selection tools
  const PixelSelectionTools = createCanvasPixelSelectionSetter(camera, overlayLength, selectedPixelOverlayRef);
  useEffect(() => {
    PixelSelectionTools.selectPixel([
      imageWorldUnitsWidth / 2 - 0.65,
      imageWorldUnitsHeight / 2.2,
      CameraPositionZ.far,
    ]);

    store?.subscribe(SELECT_PIXEL, PixelSelectionTools, "selectPixel");
    return () => {
      store?.unsubscribeAllFrom(PixelSelectionTools);
    };
    // eslint-disable-next-line
  }, []);

  // Hide selected pixel overlay if no pupper is selected
  useEffect(() => {
    if (!store?.selectedPupper) {
      PixelSelectionTools.deselectPixel();
    }
    // eslint-disable-next-line
  }, [store?.selectedPupper]);

  // Selected pixel handler
  const [isDragging, setIsDragging] = useState(false);
  const onPointUp = (e: any) => {
    if (!isDragging) {
      const [pixelX, pixelY] = getWorldPixelCoordinate(e.point, overlayLength);
      const indexX = Math.floor(pixelX + overlayLength);
      const indexY = Math.floor(pixelY + overlayLength);
      store.onPixelSelected(indexX, -1 * indexY);
      if (selectedPixelOverlayRef.current) {
        selectedPixelOverlayRef.current.visible = true;
        [selectedPixelOverlayRef.current.position.x, selectedPixelOverlayRef.current.position.y] = [pixelX, pixelY];
        selectedPixelOverlayRef.current.position.z = 0.001;
      }
    }
  };

  return (
    <Box w={"100%"} h={"100%"} position={"absolute"} zIndex={10} _focus={{ boxShadow: "none", borderColor: "inherit" }}>
      <Canvas
        camera={camera}
        onCreated={({ gl }) => {
          resizeCanvas(gl, camera);
          window.addEventListener("resize", () => resizeCanvas(gl, camera));
          gl.toneMapping = THREE.NoToneMapping;

          if (dogeMeshRef.current) {
            panZoom = createPanZoom(
              camera,
              gl.domElement.parentElement!,
              dogeMeshRef.current,
              CameraPositionZ.close,
              CameraPositionZ.far,
            );

            panZoom.on("panstart", function () {
              setIsDragging(true);
            });

            panZoom.on("panend", function () {
              setIsDragging(false);
            });
          }

          if (store?.selectedPupper) {
            PixelSelectionTools.selectPixel([store.selectedPixelX, store.selectedPixelY]);
          }
        }}
      >
        <mesh
          ref={dogeMeshRef}
          position={[imageWorldUnitsWidth / 2 - 1, (-1 * imageWorldUnitsHeight) / 2, 0]}
          onPointerMove={e => {
            if (hoverOverlayRef.current) {
              [hoverOverlayRef.current.position.x, hoverOverlayRef.current.position.y] = getWorldPixelCoordinate(
                e.point,
                overlayLength,
              );
            }

            if (tooltipRef.current) {
              //@ts-ignore
              const { pageX: mouseX, pageY: mouseY} = e;
              const box = tooltipRef.current?.getBoundingClientRect();
              //@ts-ignore
              const canvas = e.srcElement as HTMLCanvasElement;
              const { left: canvasLeft, top: canvasTop } = canvas.getBoundingClientRect();
              const tooltipOffset = 45;

              const x = mouseX - canvasLeft + tooltipOffset;
              tooltipRef.current.style.left = x + "px";

              // getBoundingClientRect() is relative to the viewport *not* the document
              // so we must account for document scroll here
              const y = mouseY - (canvasTop + window.scrollY) + tooltipOffset;
              const futureY = y + box.height;
              if (futureY < window.innerHeight - canvasTop) {
                tooltipRef.current.style.top = y + "px";
              }

              // BEWARE: below dom manipulations are heavily dependent upon the structure of <PixelPane/>
              const firstChild = tooltipRef.current?.children[0];
              const firstGrandchild = firstChild?.children[0] as HTMLDivElement;
              const secondGrandchild = firstChild?.children[1] as HTMLDivElement;
              const firstGreatGrandChild = secondGrandchild?.children[0] as HTMLDivElement;
              const [pixelX, pixelY] = getWorldPixelCoordinate(e.point, overlayLength);
              const indexX = Math.floor(pixelX + overlayLength);
              const indexY = -1 * Math.floor(pixelY + overlayLength);

              const pixelHexColor = AppStore.web3.pupperToHexLocal(
                AppStore.web3.coordinateToPupperLocal(indexX, indexY),
              );
              firstGrandchild.style.background = pixelHexColor;
              firstGreatGrandChild.innerText = `(${indexX},${indexY})`;
            }
          }}
          onPointerLeave={e => {
            if (tooltipRef.current) {
              tooltipRef.current.style.display = "none";
            }
          }}
          onPointerEnter={e => {
            if (tooltipRef.current) {
              tooltipRef.current.style.display = "block";
            }
          }}
          onPointerUp={onPointUp}
        >
          <planeGeometry attach={"geometry"} args={[imageWorldUnitsWidth, imageWorldUnitsHeight]} />
          <meshBasicMaterial attach={"material"} map={texture} depthTest={false} />
        </mesh>

        <mesh ref={selectedPixelOverlayRef} position={[0, 0, 0.0001]} visible={false}>
          <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]} />
          <meshBasicMaterial
            attach={"material"}
            color={selectedPixelColor}
            opacity={0.8}
            transparent={true}
            depthTest={false}
          />
        </mesh>

        {!AppStore.rwd.isMobile && (
          <group ref={hoverOverlayRef}>
            <mesh position={[-0.5, 0, 0.001]}>
              <planeGeometry attach={"geometry"} args={[0.05, 1.05]} />
              <meshBasicMaterial
                attach={"material"}
                color={hoveredPixelColor}
                opacity={1}
                transparent={true}
                depthTest={false}
              />
            </mesh>
            <mesh position={[0.5, 0, 0.001]}>
              <planeGeometry attach={"geometry"} args={[0.05, 1.05]} />
              <meshBasicMaterial
                attach={"material"}
                color={hoveredPixelColor}
                opacity={1}
                transparent={true}
                depthTest={false}
              />
            </mesh>
            <mesh position={[0, 0.5, 0.001]} rotation={new THREE.Euler(0, 0, Math.PI / 2)}>
              <planeGeometry attach={"geometry"} args={[0.05, 1]} />
              <meshBasicMaterial
                attach={"material"}
                color={hoveredPixelColor}
                opacity={1}
                transparent={true}
                depthTest={false}
              />
            </mesh>
            <mesh position={[0, -0.5, 0.001]} rotation={new THREE.Euler(0, 0, -Math.PI / 2)}>
              <planeGeometry attach={"geometry"} args={[0.05, 1]} />
              <meshBasicMaterial
                attach={"material"}
                color={hoveredPixelColor}
                opacity={1}
                transparent={true}
                depthTest={false}
              />
            </mesh>
          </group>
        )}

        {showOwned && AppStore.web3.addressToPuppers && (
          <>
            {Object.keys(AppStore.web3.addressToPuppers).map((address: string) => {
              const tokens = AppStore.web3.addressToPuppers?.[address].tokenIds;
              return tokens?.map(token => {
                const [x, y] = AppStore.web3.pupperToPixelCoordsLocal(token);
                const xPos = x - overlayLength / 2;
                const yPos = -1 * y - overlayLength / 2;
                return (
                  <mesh position={[xPos, yPos, 0.0001]} visible={true}>
                    <planeGeometry attach={"geometry"} args={[overlayLength, overlayLength]} />
                    <meshBasicMaterial
                      attach={"material"}
                      color={ownedPixelColor}
                      opacity={0.8}
                      transparent={true}
                      depthTest={false}
                    />
                  </mesh>
                );
              });
            })}
          </>
        )}
      </Canvas>
      {!AppStore.rwd.isMobile && (
        <Box ref={tooltipRef} position={"absolute"} zIndex={10} display={"none"} pointerEvents={"none"}>
          <PixelPane size={"md"} pupper={1113825} />
        </Box>
      )}
      <Box position={"absolute"} bottom={0} left={0} p={2}>
        <Flex flexDir={"column"} gap={2}>
          <Button size={"xs"} variant={ButtonVariant.Text} onClick={() => setShowOwned(!showOwned)}>
            {showOwned ? "hide" : "show"} owned
          </Button>
          <SearchInputs store={store} />
        </Flex>
      </Box>
    </Box>
  );
});

const SearchInputs: React.FC<{ store: ViewerStore }> = observer(({ store }) => {
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  useEffect(() => {
    if (store.selectedPupper) {
      setX(store.selectedPixelX);
      setY(store.selectedPixelY);
    }
  }, [store.selectedPupper]);

  const search = () => {
    if (x < 640 && x >= 0 && y < 480 && y >= 0) {
      store.onCoordsSearch(x, y);
    }
  };

  return (
    <Flex alignItems={"center"} gap={2}>
      <Box>
        <Typography variant={TVariant.PresStart10}>X:</Typography>
        <Input
          w={10}
          h={5}
          fontSize={8}
          padding={0}
          textAlign="center"
          zIndex={9999}
          borderRadius={0}
          type="number"
          onChange={(e: any) => setX(Number(e.target.value))}
          value={x}
        />
      </Box>
      <Box>
        <Typography variant={TVariant.PresStart10}>Y:</Typography>
        <Input
          w={10}
          h={5}
          fontSize={8}
          padding={0}
          textAlign="center"
          zIndex={9999}
          borderRadius={0}
          type="number"
          onChange={(e: any) => setY(Number(e.target.value))}
          value={y}
        />
      </Box>
      <Box cursor="pointer" onClick={() => search()}>
        <Icon icon={"search"} boxSize={4} />
      </Box>
    </Flex>
  );
});

export default DogeExplorer;
