import React, {useCallback, useRef} from 'react';
import * as THREE from 'three';
import {Canvas, useFrame, useLoader, useThree} from "@react-three/fiber";
import KobosuImage from "../../images/kobosu.jpeg"
import {Box, HStack} from "@chakra-ui/react";
import Button from "../../DSL/Button/Button";
import {Object3D} from "three";


const FiberScene = () => {
    const camera = new THREE.PerspectiveCamera(
        5,
        window.innerWidth / window.innerHeight,
        0.0000001,
        1000
    )
    camera.lookAt(0,0,0)
    camera.position.z = 0.1
    const cameraMovementSensitivity = 0.1

    const canvasParentRef = useCallback((node: HTMLDivElement) => {
        if (node) {
            const width = node.clientWidth
            const height = node.clientHeight
            camera.aspect = width / height
            camera.updateProjectionMatrix()
        }
    }, [])

    const texture = useLoader(THREE.TextureLoader, KobosuImage)
    texture.magFilter = THREE.NearestFilter
    const scale = 1
    const aspectRatio = texture.image.width / texture.image.height

    const overlayRef = useRef<Object3D>(null)

    return <Box ref={canvasParentRef} position={"relative"} w={"100%"} h={"100%"}>
        <Canvas camera={camera}>
            <mesh
                position={[0,0,0]}
                onPointerMove={(e) => {
                    const {point} = e
                    if (overlayRef.current) {
                        overlayRef.current.position.x = point.x
                        overlayRef.current.position.y = point.y
                    }
                }}
            >
                <planeGeometry attach={"geometry"} args={[aspectRatio * scale, scale]}/>
                <meshBasicMaterial attach={"material"} map={texture} lightMapIntensity={0.1}/>
            </mesh>
            <mesh ref={overlayRef} position={[0,0,0.0001]}>
                <planeGeometry attach={"geometry"} args={[0.0021, 0.0021]}/>
                <meshBasicMaterial color={0x000000}/>
            </mesh>
        </Canvas>
        <HStack spacing={2} pos={"absolute"} left={0} bottom={0} m={10}>
            <Button onClick={() => camera.position.z -= cameraMovementSensitivity}>+</Button>
            <Button onClick={() => camera.position.z += cameraMovementSensitivity}>-</Button>
            <Button onClick={() => camera.position.x -= cameraMovementSensitivity}>left</Button>
            <Button onClick={() => camera.position.x += cameraMovementSensitivity}>right</Button>
            <Button onClick={() => camera.position.y -= cameraMovementSensitivity}>down</Button>
            <Button onClick={() => camera.position.y += cameraMovementSensitivity}>up</Button>
        </HStack>
    </Box>
}

export default FiberScene
