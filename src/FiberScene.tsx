import React, {Suspense, useEffect, useRef, useState} from 'react';
import * as THREE from 'three';
import {Canvas, useFrame, useLoader} from "@react-three/fiber";
import KobosuImage from "./images/kobosu.jpeg"
import KobosuPixels from "./images/kobosu.json"


const FiberScene = () => {
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
    // const mesh = useRef()
    // const texture = useLoader(THREE.TextureLoader, KobosuImage)
    return <>
        {KobosuPixels.map((row, yindex) => {
            if (yindex > 5) {
                return <></>
            } else {
                return row.map((pixel, xindex) => {
                    return <mesh key={`${yindex}-${xindex}`} position={new THREE.Vector3(xindex+10-300, yindex+10, -200)}>
                        <planeBufferGeometry attach={"geometry"} args={[10,10]}/>
                        <meshBasicMaterial attach={"material"} color={pixel}/>
                    </mesh>
                })
            }
        })}
    </>
}

export default FiberScene
