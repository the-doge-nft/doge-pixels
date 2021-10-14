import React, {Suspense, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import KobosuImage from "./images/kobosu.jpeg"
import {DoubleSide} from "three/src/constants";

const Scene = () => {
    const canvasRef = useRef(null)

    useEffect(() => {
        if (canvasRef.current) {
            console.log(canvasRef.current)
            //@ts-ignore
            // canvasRef.current.getImageRef()
        }
    }, [canvasRef.current])

    return <>
        <Canvas
            ref={canvasRef}
            // camera={new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 1, 1000)}
        >
            <pointLight position={[10, 10, 10]} />
            <Suspense fallback={<>Loading profile...</>}>
                <Kobosu />
            </Suspense>
        </Canvas>
    </>
}

const Kobosu = () => {
    const mesh = useRef()
    const texture = useLoader(THREE.TextureLoader, KobosuImage)

    useFrame((state) => {
        state.camera.position.z = 400
        state.camera.updateProjectionMatrix()
    })
    useFrame(() => {
        if (mesh.current) {
            // //@ts-ignore
            // mesh.current.rotation.x += 0.005
            // //@ts-ignore
            // mesh.current.rotation.y += 0.005
        }
    })
    return <>
        <mesh ref={mesh}>
            <planeBufferGeometry attach={"geometry"} args={[640,480]}/>
            <meshBasicMaterial map={texture}/>
        </mesh>
    </>
}

export default Scene
