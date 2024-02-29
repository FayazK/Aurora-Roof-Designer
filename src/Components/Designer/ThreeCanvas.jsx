import React from 'react';
import { Canvas } from '@react-three/fiber';
import DynamicDrawing from "./DynamicDrawing.jsx";
import {SceneLighting} from "./CanvasComponents.jsx";

const ThreeCanvas = () => {
    // Define your Three.js objects here
    return (
        <Canvas>
            <DynamicDrawing/>
            <SceneLighting/>
        </Canvas>
    );
}

export default ThreeCanvas;
