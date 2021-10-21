import React, {useEffect, useRef} from "react"
import * as THREE from "three"
import {WEBGL} from "./helpers/webgl";
import KobosuPixels from "./images/kobosu.json"
import {Scene} from "three/src/scenes/Scene";
import Stats from "three/examples/jsm/libs/stats.module";
import KobosuImage from "./images/kobosu.jpeg"
import Button from "./DSL/Button/Button";

const renderPixels = (scene: Scene) => {
    const pixelGeometry = new THREE.PlaneGeometry(0.5,0.5)
    KobosuPixels.forEach((row, yIndex) => {
        if (yIndex < 20) {
            row.forEach((pixel, xIndex) => {
                const material = new THREE.MeshBasicMaterial({color: pixel})
                const plane = new THREE.Mesh(pixelGeometry, material)
                plane.position.x = -100 + xIndex/2
                plane.position.y = yIndex/2
                scene.add(plane)
            })
        }
    })
}

const renderImage = (scene: Scene) => {
    const imageTexture = new THREE.TextureLoader().load(KobosuImage)
    const imageMaterial = new THREE.MeshBasicMaterial({map: imageTexture})
    const ratio = 640/480
    const imagePlane = new THREE.PlaneGeometry(5*ratio, 5)
    const image = new THREE.Mesh(imagePlane, imageMaterial)
    scene.add(image)
}

const appendToSceneDom = (node: HTMLElement) => {
    const sceneDom = document.getElementById("scene")
    sceneDom!.appendChild(node)
}

const ThreeScene = () => {
    const ref = useRef(null)
    //@ts-ignore
    var stats = new Stats()
    stats.showPanel( 0 )

    useEffect(() => {
        appendToSceneDom(renderer.domElement)
        appendToSceneDom(stats.dom)
    }, [])

    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    const renderer = new THREE.WebGLRenderer()
    renderer.setSize(window.innerWidth, window.innerHeight)

    renderImage(scene)

    camera.position.z = 5
    const animate = () => {
        stats.begin();
        // camera.position.z -= 0.5
        stats.end();
        requestAnimationFrame( animate )
        renderer.render(scene, camera);
    }

    if (WEBGL.isWebGLAvailable()) {
        animate()
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        appendToSceneDom(warning)
    }

    const cameraZoomSensitivity = 0.2

    return <div style={{position: "relative"}}>
        <div id="scene"/>
        <div style={{position: "absolute", left: "0", bottom: "0", margin: "10px"}}>
            <Button onClick={() => camera.position.z -= cameraZoomSensitivity}>+</Button>
            <Button onClick={() => camera.position.z += cameraZoomSensitivity}>-</Button>
        </div>
    </div>
}

export default ThreeScene
