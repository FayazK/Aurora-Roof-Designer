import {Canvas, useThree} from '@react-three/fiber';
import DynamicDrawing from "./Designer/DynamicDrawing.jsx";
import {MapTile} from "./Designer/MapTile.jsx";
import {SceneLighting} from "./Designer/CanvasComponents.jsx";
import {cameraProps, glProps} from "../helpers/global_props.js";
import {OrbitControls, OrthographicCamera, MapControls} from "@react-three/drei";
import {MOUSE, Vector3} from 'three';
import {useRecoilValue} from "recoil";
import {topViewAtom} from "../helpers/atoms.js";
import {ViewController} from "./Designer/ViewController.jsx";


export default function Designer() {
    return (<>
        <Canvas camera={cameraProps} gl={glProps}>
            <OrthographicCamera >
                <DynamicDrawing/>
                <MapTile imageUrl={'staticmap.png'}/>
                <SceneLighting/>
                <ViewController />
            </OrthographicCamera>
        </Canvas>
    </>)
}// Designer
