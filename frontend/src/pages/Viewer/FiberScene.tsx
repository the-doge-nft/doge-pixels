import React, {useCallback, useRef} from 'react';
import * as THREE from 'three';
import {Object3D} from 'three';
import {Canvas, useLoader} from "@react-three/fiber";
import KobosuImage from "../../images/kobosu.jpeg"
import {Box, HStack} from "@chakra-ui/react";
import Button from "../../DSL/Button/Button";
import Typography, {TVariant} from "../../DSL/Typography/Typography";

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
    const imageRef = useCallback(node => {
        if (node) {
            node.geometry.computeBoundingBox()
            console.log("debug::", node.geometry.boundingBox)
        }
    }, [])

    return <Box ref={canvasParentRef} position={"relative"} w={"100%"} h={"100%"}>
        <Canvas camera={camera}>
            <mesh
                ref={imageRef}
                position={[0,0,0]}
                onPointerMove={(e) => {
                    const {point} = e

                    console.log("x::", point.x)
                    console.log("y::", point.y)

                    if (overlayRef.current) {
                        overlayRef.current.position.x = point.x
                        overlayRef.current.position.y = point.y
                    }
                }}
            >
                <planeGeometry attach={"geometry"} args={[aspectRatio * scale, scale]}/>
                <meshBasicMaterial attach={"material"} map={texture}/>
            </mesh>
            <mesh ref={overlayRef} position={[0,0,0.0001]}>
                <planeGeometry attach={"geometry"} args={[0.00205, 0.00205]}/>
                <meshBasicMaterial attach={"material"} color={0xff0000} opacity={0.5} transparent={true}/>
            </mesh>
        </Canvas>
        <HStack spacing={2} pos={"absolute"} left={0} bottom={0} m={10}>
            <Button onClick={() => camera.position.z -= cameraMovementSensitivity}>
                <Typography variant={TVariant.Body14}>+</Typography>
            </Button>
            <Button onClick={() => camera.position.z += cameraMovementSensitivity}>
                <Typography variant={TVariant.Body14}>-</Typography>
            </Button>
            <Button onClick={() => camera.position.x -= cameraMovementSensitivity}>
                <Typography variant={TVariant.Body14}>left</Typography>
            </Button>
            <Button onClick={() => camera.position.x += cameraMovementSensitivity}>
                <Typography variant={TVariant.Body14}>right</Typography>
            </Button>
            <Button onClick={() => camera.position.y -= cameraMovementSensitivity}>
                <Typography variant={TVariant.Body14}>down</Typography>
            </Button>
            <Button onClick={() => camera.position.y += cameraMovementSensitivity}>
                <Typography variant={TVariant.Body14}>up</Typography>
            </Button>
        </HStack>
    </Box>
}

export default FiberScene
