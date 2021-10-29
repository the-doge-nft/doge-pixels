import React, {useCallback, useEffect, useState} from "react"
import * as THREE from "three"
import {WEBGL} from "../../helpers/webgl";
import KobosuPixels from "../../images/kobosu.json"
import Stats from "three/examples/jsm/libs/stats.module";
import KobosuImage from "../../images/kobosu.jpeg"
import Button from "../../DSL/Button/Button";
import {Box, HStack} from "@chakra-ui/react";
import {Scene} from "three";
import UITools from "./UITools";

const renderImage = (scene: Scene) => {
        new THREE.TextureLoader().load(KobosuImage, (texture) => {
        texture.magFilter = THREE.NearestFilter;

        const material = new THREE.MeshBasicMaterial({map: texture})
        const scale = 1
        const ratio = texture.image.width / texture.image.height
        const imagePlane = new THREE.PlaneGeometry(scale * ratio, scale)
        const image = new THREE.Mesh(imagePlane, material)
        scene.add(image)
    })
}

const ThreeScene = () => {
    //@ts-ignore
    var stats = new Stats()
    stats.showPanel(0)
    stats.dom.style.position = "absolute"

    const sceneRef = useCallback((node: HTMLDivElement) => {
        // https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
        setTimeout(() => {
            if (node !== null) {
                console.log("debug::node width", node.clientWidth)
                console.log("debug::node height", node.clientHeight)

                node.appendChild(renderer.domElement)
                node.appendChild(stats.dom)

                const parentWidth = node.clientWidth
                const parentHeight = node.clientHeight
                renderer.setSize(parentWidth, parentHeight)
                camera.aspect = parentWidth / parentHeight;
                camera.updateProjectionMatrix()

                if (WEBGL.isWebGLAvailable()) {
                    animate()
                } else {
                    const warning = WEBGL.getWebGLErrorMessage();
                    node.appendChild(warning)
                }
            }
        })
    }, [])

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.000001, 1000)
    const cameraMovementSensitivity = 0.01
    camera.position.z = 0.1

    const renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio);

    const render = () => {
        // if (sceneRef.current && resizeRendererToDisplaySize(renderer, sceneRef.current)) {
        //     const canvas = renderer.domElement;
        //     camera.aspect = canvas.clientWidth / canvas.clientHeight;
        //     camera.updateProjectionMatrix();
        // }
        // colorOnHover(camera, scene)
        renderer.render(scene, camera);
    }

    const animate = () => {
        render()
        stats.update()
        window.requestAnimationFrame(animate)
    }

    renderImage(scene)


    const [cameraX, setCameraX] = useState(camera.position.x)
    useEffect(() => {
        console.log("effect running")
        setCameraX(camera.position.x)
    }, [camera.position.x])

    return <Box pos={"relative"} id="container" w={"100%"} h={"100%"}>
        <UITools/>
        <div ref={sceneRef} id="scene-container" style={{width: "100%", height: "100%"}}/>
        <HStack spacing={2} pos={"absolute"} left={0} bottom={0} m={10}>
            <Button onClick={() => camera.position.z -= cameraMovementSensitivity}>+</Button>
            <Button onClick={() => camera.position.z += cameraMovementSensitivity}>-</Button>
            <Button onClick={() => {
                camera.position.x -= cameraMovementSensitivity
                console.log("debug::camera position", camera.position.x)
            }}>left</Button>
            <Button onClick={() => camera.position.x += cameraMovementSensitivity}>right</Button>
            <Button onClick={() => camera.position.y -= cameraMovementSensitivity}>down</Button>
            <Button onClick={() => camera.position.y += cameraMovementSensitivity}>up</Button>
            {camera && <CameraStats x={cameraX}/>}
        </HStack>
    </Box>
}

const CameraStats = ({x}: {x: number}) => {
    // const [x, setX] = useState(cameraPosition.x)
    // const [y, setY] = useState(cameraPosition.y)
    // const [z, setZ] = useState(cameraPosition.z)

    // useEffect(() => {
    //     console.log("debug::run effect")
    //     setX(cameraPosition.x)
    //     setY(cameraPosition.y)
    //     setZ(cameraPosition.z)
    //
    // }, [cameraPosition.x, cameraPosition.y, cameraPosition.z])

    console.log("debug::x", x)
    // console.log("debug::y", y)
    // console.log("debug::z", z)

    console.log("debug::render")

    return <HStack>
        <Box>camera x: {x}</Box>
        {/*<Box>camera y: {y}</Box>*/}
        {/*<Box>camera z: {z}</Box>*/}

    </HStack>
}

export default ThreeScene
