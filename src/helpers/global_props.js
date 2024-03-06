import {Vector3} from "three";

export const glProps = {antialias: true, alpha: false, logarithmicDepthBuffer: true}

const mapSize = 10; // Assuming the size of your map tile is 10 units

export const cameraProps = {
    fov: 75, // Typical field of view for perspective camera
    aspect: window.innerWidth / window.innerHeight, // Aspect ratio of the canvas
    near: 0.1,
    far: 1000,
    position: new Vector3(0, 0, 5) // Adjust position as needed
}