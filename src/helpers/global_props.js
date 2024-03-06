import {Vector3} from "three";

export const glProps = {antialias: true, alpha: false, logarithmicDepthBuffer: true}

const mapSize = 10; // Assuming the size of your map tile is 10 units

export const cameraProps = {
    position: new Vector3(0, 0, 5),
    zoom: 1, // Set the zoom level
    left: -mapSize / 2, // Left boundary
    right: mapSize / 2, // Right boundary
    top: mapSize / 2, // Top boundary
    bottom: -mapSize / 2, // Bottom boundary
    near: .1, // Near clipping plane
    far: 10000 // Far clipping plane
}