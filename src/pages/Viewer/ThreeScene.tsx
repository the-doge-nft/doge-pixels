import React, {useCallback, useEffect, useRef} from "react"
import * as THREE from "three"
import {WEBGL} from "../../helpers/webgl";
import KobosuPixels from "../../images/kobosu.json"
import Stats from "three/examples/jsm/libs/stats.module";
import KobosuImage from "../../images/kobosu.jpeg"
import Button from "../../DSL/Button/Button";
import {Box, HStack} from "@chakra-ui/react";
import {Scene, WebGLRenderer} from "three";
import colorOnHover from "./colorOnHover";
import UITools from "./UITools";

const renderPixels = (scene: Scene) => {
    const pixelGeometry = new THREE.PlaneGeometry(0.5, 0.5)
    KobosuPixels.forEach((row, yIndex) => {
        if (yIndex < 40) {
            row.forEach((pixel, xIndex) => {
                if (xIndex > 100 && xIndex < 500) {
                    const material = new THREE.MeshBasicMaterial({color: pixel})
                    const plane = new THREE.Mesh(pixelGeometry, material)
                    plane.position.x = -100 + xIndex / 2
                    plane.position.y = yIndex / 2
                    scene.add(plane)
                }
            })
        }
    })
}

const renderImage = (scene: Scene, renderer: WebGLRenderer) => {
    const texture = new THREE.TextureLoader().load(KobosuImage)
    texture.magFilter = THREE.NearestFilter;
    texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const material = new THREE.MeshBasicMaterial({map: texture})
    const ratio = 640 / 480
    const imagePlane = new THREE.PlaneGeometry(5 * ratio, 5)
    const image = new THREE.Mesh(imagePlane, material)
    scene.add(image)
}

// function resizeRendererToDisplaySize(renderer: WebGLRenderer, parentDom: HTMLDivElement) {
//     const canvas = renderer.domElement;
//     const width = parentDom.clientWidth;
//     const height = parentDom.clientHeight;
//     const needResize = canvas.width !== width || canvas.height !== height;
//     if (needResize) {
//         console.log("debug::needs resize")
//         renderer.setSize(width, height, false);
//     }
//     return needResize;
// }

const ThreeScene = () => {
    //@ts-ignore
    var stats = new Stats()
    stats.showPanel(0)
    stats.dom.style.position = "absolute"

    const sceneRef = useCallback((node: HTMLDivElement) => {
        // https://reactjs.org/docs/refs-and-the-dom.html#caveats-with-callback-refs
        setTimeout(() => {
            if (node !== null) {
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
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const cameraMovementSensitivity = 0.1
    camera.position.z = 3.5
    const renderer = new THREE.WebGLRenderer({antialias: true})
    renderer.setPixelRatio(window.devicePixelRatio);

    const cameraAction = (callback: () => {}) => {
        callback()
        camera.updateProjectionMatrix()
    }

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

    renderImage(scene, renderer)
    // renderPixels(scene)

    return <Box pos={"relative"} id="container" w={"100%"} h={"100%"}>
        <UITools/>
        <div ref={sceneRef} id="scene-container" style={{width: "100%", height: "100%"}}/>
        <HStack spacing={2} pos={"absolute"} left={0} bottom={0} m={10}>
            <Button onClick={() => cameraAction(() => camera.position.z -= cameraMovementSensitivity)}>+</Button>
            <Button onClick={() => cameraAction(() => camera.position.z += cameraMovementSensitivity)}>-</Button>
            <Button onClick={() => cameraAction(() => camera.position.x -= cameraMovementSensitivity)}>left</Button>
            <Button onClick={() => cameraAction(() => camera.position.x += cameraMovementSensitivity)}>right</Button>
            <Button onClick={() => cameraAction(() => camera.position.y -= cameraMovementSensitivity)}>down</Button>
            <Button onClick={() => cameraAction(() => camera.position.y += cameraMovementSensitivity)}>up</Button>
        </HStack>
    </Box>
}

export default ThreeScene
