import {Canvas} from '@react-three/fiber';
import DynamicDrawing from "./Designer/DynamicDrawing.jsx";
import {MapTile} from "./Designer/MapTile.jsx";
import {SceneLighting} from "./Designer/CanvasComponents.jsx";
import {cameraProps, glProps} from "../helpers/global_props.js";
import {OrbitControls, OrthographicCamera} from "@react-three/drei";
import {ViewController} from "./Designer/ViewController.jsx";


export default function Designer() {
    return (<>
        <Canvas gl={glProps}>
            <OrthographicCamera
                name="2d"
                position={[0, 2, 0]}
                zoom={100}
                near={-100}
                far={100}
                left={window.innerWidth / -2}
                right={window.innerWidth / 2}
                top={window.innerHeight / 2}
                bottom={window.innerHeight / -2}
            />
            <SceneLighting/>
            <DynamicDrawing/>
            <MapTile imageUrl={'staticmap.png'}/>
            <ViewController />
        </Canvas>
    </>)
}// Designer
