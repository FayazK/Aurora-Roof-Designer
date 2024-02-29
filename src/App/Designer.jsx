import React from 'react';
import {Canvas} from '@react-three/fiber';
import {SceneLighting} from "./DesignerComponents/CanvasComponents";
import {cameraProps, glProps} from "../helpers/Properties";
import DynamicDrawing from "./DesignerComponents/DynamicDrawing";
import {MapTile} from "./DesignerComponents/MapTile";


export default function Designer() {

    return (<Canvas camera={cameraProps} gl={glProps}>
        <DynamicDrawing/>
        <MapTile imageUrl={'staticmap.png'}/>
        <SceneLighting/>
    </Canvas>)
}// Designer
