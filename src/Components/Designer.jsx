import {Canvas} from '@react-three/fiber';
import DynamicDrawing from "./Designer/DynamicDrawing.jsx";
import {MapTile} from "./Designer/MapTile.jsx";
import {SceneLighting} from "./Designer/CanvasComponents.jsx";
import {cameraProps, glProps} from "../helpers/global_props.js";
import {DesignerOrbitControls} from "./Designer/DesignerOrbitControls.jsx";
import {OrbitControls, OrthographicCamera} from "@react-three/drei";


export default function Designer() {

    return (<Canvas camera={cameraProps} gl={glProps}>
        <OrthographicCamera>
            <DynamicDrawing/>
            <MapTile imageUrl={'staticmap.png'}/>
            <SceneLighting/>
            <DesignerOrbitControls/>
        </OrthographicCamera>
    </Canvas>)
}// Designer
