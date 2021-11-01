import {Mesh, MeshBasicMaterial, PerspectiveCamera, PlaneGeometry, Scene} from "three";
import * as THREE from "three";

interface IIntersect extends Mesh<PlaneGeometry, MeshBasicMaterial> {
    currentHex: any
}

const mouse = new THREE.Vector2();
function onMouseMove(event: MouseEvent) {
    mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
    mouse.y = -(event.clientY / window.innerHeight) * 2 + 1;
}
window.addEventListener('mousemove', onMouseMove, false);

let intersect: IIntersect | null
const intersectColor = 0xff0000;
const raycaster = new THREE.Raycaster();

const colorOnHover = (camera: PerspectiveCamera, scene: Scene) => {
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects<Mesh<PlaneGeometry, MeshBasicMaterial>>(scene.children, false);
    if (intersects.length > 0) {
        if (intersect != intersects[0].object) {
            // set previous intersect back to original color
            if (intersect) {
                intersect.material.color.setHex(intersect.currentHex)
                intersect.material.opacity = 1
            }
            ;

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

export default colorOnHover;