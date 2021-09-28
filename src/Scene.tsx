import React, {Suspense, useRef, useState} from 'react';
import * as THREE from 'three';
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import KobosuImage from "./images/kobosu.jpeg"
import {DoubleSide} from "three/src/constants";
import {Side} from "three";


const Scene = () => {
    return <>
        <Canvas>
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
    useFrame(() => {
        if (mesh.current) {
            //@ts-ignore
            mesh.current.rotation.x += 0.005
            //@ts-ignore
            mesh.current.rotation.y += 0.005
        }
    })
    return <>
        <mesh ref={mesh}>
            <planeBufferGeometry attach={"geometry"} args={[10,10]}/>
            <meshBasicMaterial map={texture} side={DoubleSide}/>
        </mesh>
    </>
}

export default Scene
