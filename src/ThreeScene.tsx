import React, {useEffect, useRef, useState} from "react"
import * as THREE from "three"
import {WEBGL} from "./helpers/webgl";
import KobosuPixels from "./images/kobosu.json"
import {Scene} from "three/src/scenes/Scene";
import Stats from "three/examples/jsm/libs/stats.module";
import KobosuImage from "./images/kobosu.jpeg"
import Button from "./DSL/Button/Button";
import {Box} from "@chakra-ui/react";
import {Mesh} from "three/src/objects/Mesh";
import {MeshBasicMaterial, PlaneGeometry} from "three";

const renderPixels = (scene: Scene) => {
    const pixelGeometry = new THREE.PlaneGeometry(0.5,0.5)
    KobosuPixels.forEach((row, yIndex) => {
        if (yIndex < 10) {
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
    renderer.setPixelRatio( window.devicePixelRatio );
    renderer.setSize(window.innerWidth, window.innerHeight)

    // renderImage(scene)
    renderPixels(scene)

    camera.position.z = 20

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const cameraZoomSensitivity = 3


    function onMouseMove( event: MouseEvent ) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMouseMove, false);

    function onWindowResize() {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize( window.innerWidth, window.innerHeight );
    }
    window.addEventListener( 'resize', onWindowResize );


    const animate = () => {
        render()
        stats.update()
        window.requestAnimationFrame(animate)
    }

    interface IIntersect extends Mesh<PlaneGeometry, MeshBasicMaterial> {
       currentHex: any
    }

    let intersect: IIntersect | null
    const intersectColor = 0xff0000;

    const render = () => {
        raycaster.setFromCamera(mouse, camera);
        const intersects = raycaster.intersectObjects<Mesh<PlaneGeometry, MeshBasicMaterial>>(scene.children, false);
        if (intersects.length > 0) {
            if (intersect != intersects[0].object) {
                // set previous intersect back to original color
                if (intersect) {
                    intersect.material.color.setHex(intersect.currentHex)
                    intersect.material.opacity = 1
                };

                // update intersect to new object with new color
                intersect = intersects[0].object as IIntersect;
                intersect.currentHex = intersect.material.color.getHex();
                intersect.material.color.setHex(intersectColor);
                intersect.material.opacity = 0.1
            }
        } else {
            // mouse does not intersect, reset color on previously hovered mesh
            if (intersect) {
                intersect.material.color.setHex(intersect.currentHex);
                intersect.material.opacity = 1
            }
            intersect = null;
        }
        renderer.render(scene, camera);
    }

    // run or render error
    if (WEBGL.isWebGLAvailable()) {
        animate()
    } else {
        const warning = WEBGL.getWebGLErrorMessage();
        appendToSceneDom(warning)
    }

    return <Box pos={"relative"} id="container">
        <Box id="scene"/>
        <Box pos={"absolute"} left={0} bottom={0} m={10}>
            <Button onClick={() => camera.position.z -= cameraZoomSensitivity}>+</Button>
            <Button onClick={() => camera.position.z += cameraZoomSensitivity}>-</Button>

            <Button onClick={() => camera.position.x -= cameraZoomSensitivity}>left</Button>
            <Button onClick={() => camera.position.x += cameraZoomSensitivity}>right</Button>

            <Button onClick={() => camera.position.y -= cameraZoomSensitivity}>down</Button>
            <Button onClick={() => camera.position.y += cameraZoomSensitivity}>up</Button>
        </Box>
    </Box>
}

export default ThreeScene
