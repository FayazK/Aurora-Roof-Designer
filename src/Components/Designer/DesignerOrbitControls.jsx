import {OrbitControls} from "@react-three/drei";
import {useThree} from "@react-three/fiber";
import {memo} from "react";

export const DesignerOrbitControls = memo(() => {
    const {camera} = useThree(); // Access the camera
    return <OrbitControls camera={camera}/>
})