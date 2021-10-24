import React, {useEffect, useRef} from "react"
import * as THREE from "three"
import {WEBGL} from "../../helpers/webgl";
import KobosuPixels from "../../images/kobosu.json"
import Stats from "three/examples/jsm/libs/stats.module";
import KobosuImage from "../../images/kobosu.jpeg"
import Button from "../../DSL/Button/Button";
import {Box, HStack} from "@chakra-ui/react";
import {Mesh, MeshBasicMaterial, PlaneGeometry, Scene} from "three";
import UITools from "./UITools";

const renderPixels = (scene: Scene) => {
    const pixelGeometry = new THREE.PlaneGeometry(0.5,0.5)
    KobosuPixels.forEach((row, yIndex) => {
        if (yIndex < 40) {
            row.forEach((pixel, xIndex) => {
                if (xIndex > 100 && xIndex < 500) {
                    const material = new THREE.MeshBasicMaterial({color: pixel})
                    const plane = new THREE.Mesh(pixelGeometry, material)
                    plane.position.x = -100 + xIndex/2
                    plane.position.y = yIndex/2
                    scene.add(plane)
                }
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

function resizeRendererToDisplaySize(renderer: any) {
    const canvas = renderer.domElement;
    const parent = document.getElementById("scene")
    const width = parent?.clientWidth;
    const height = parent?.clientHeight;
    const needResize = canvas.width !== width || canvas.height !== height;
    if (needResize) {
        renderer.setSize(width, height, false);
    }
    return needResize;
}

const ThreeScene = () => {
    const sceneRef = useRef<HTMLDivElement>(null)

    //@ts-ignore
    var stats = new Stats()
    stats.showPanel( 0 )
    stats.dom.style.position = "absolute"

    useEffect(() => {
        sceneRef.current?.appendChild(renderer.domElement)
        sceneRef.current?.appendChild(stats.dom)

        // run or render error
        if (WEBGL.isWebGLAvailable()) {
            animate()
        } else {
            const warning = WEBGL.getWebGLErrorMessage();
            sceneRef.current?.appendChild(warning)
        }

    }, [])

    const scene = new THREE.Scene()
    scene.background = new THREE.Color(0xffffff)
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000)
    camera.position.z = 3.5
    const renderer = new THREE.WebGLRenderer()

    resizeRendererToDisplaySize(renderer)

    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();
    const cameraZoomSensitivity = 0.5


    function onMouseMove( event: MouseEvent ) {
        mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
        mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
    }
    window.addEventListener('mousemove', onMouseMove, false);

    function onWindowResize() {
        // resizeRendererToDisplaySize(renderer)
        // camera.aspect = window.innerWidth / window.innerHeight;
        // camera.updateProjectionMatrix();
        // renderer.setSize( window.innerWidth, window.innerHeight );
    }
    window.addEventListener( 'resize', onWindowResize );


    interface IIntersect extends Mesh<PlaneGeometry, MeshBasicMaterial> {
       currentHex: any
    }

    let intersect: IIntersect | null
    const intersectColor = 0xff0000;

    const colorOnHover = () => {
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
    }

    const cameraAction = (callback: () => {}) => {
        callback()
        camera.updateProjectionMatrix()
    }

    const render = () => {
        if (resizeRendererToDisplaySize(renderer)) {
            const canvas = renderer.domElement;
            camera.aspect = canvas.clientWidth / canvas.clientHeight;
            camera.updateProjectionMatrix();
        }
        colorOnHover()
        renderer.render(scene, camera);
    }

    const animate = () => {
        render()
        stats.update()
        window.requestAnimationFrame(animate)
    }

    // renderImage(scene)
    renderPixels(scene)

    return <Box pos={"relative"} id="container" w={"full"} h={"full"}>
        <UITools />
        <Box ref={sceneRef} id="scene" w={"full"} h={"full"}/>
        <HStack spacing={2} pos={"absolute"} left={0} bottom={0} m={10}>
            <Button onClick={() => cameraAction(() => camera.position.z -= cameraZoomSensitivity)}>+</Button>
            <Button onClick={() => cameraAction(() => camera.position.z += cameraZoomSensitivity)}>-</Button>
            <Button onClick={() => cameraAction(() => camera.position.x -= cameraZoomSensitivity)}>left</Button>
            <Button onClick={() => cameraAction(() => camera.position.x += cameraZoomSensitivity)}>right</Button>
            <Button onClick={() => cameraAction(() => camera.position.y -= cameraZoomSensitivity)}>down</Button>
            <Button onClick={() => cameraAction(() => camera.position.y += cameraZoomSensitivity)}>up</Button>
        </HStack>
    </Box>
}

export default ThreeScene
