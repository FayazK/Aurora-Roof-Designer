import React from 'react';
import {Canvas} from '@react-three/fiber';
import DynamicDrawing from './DesignerComponents/DynamicDrawing';
import {SceneLighting} from "./DesignerComponents/CanvasComponents";
import {cameraProps, glProps} from "../helpers/Properties";

export default function Designer() {
    return (<Canvas camera={cameraProps} gl={glProps}>
        <SceneLighting/>
        <DynamicDrawing/>
    </Canvas>)
}// Designer
