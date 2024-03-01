import {GizmoHelper, GizmoViewport, OrbitControls} from "@react-three/drei";
import {memo} from "react";

export const DesignerOrbitControls = ()=>{
    return <>
        <GizmoHelper
            alignment="bottom-right" // widget alignment within scene
            margin={[80, 80]} // widget margins (X, Y)
            rotation={true} // enable rotation
        >
            <GizmoViewport axisColors={['red', 'green', 'blue']} labelColor="black" />
        </GizmoHelper>
        <OrbitControls />
    </>
}