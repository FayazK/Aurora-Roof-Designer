import React, {memo} from "react";
import {OrbitControls} from "@react-three/drei";
import {useThree} from "@react-three/fiber";

export const DesignerOrbitControls = memo(() => {
    const {camera} = useThree(); // Access the camera
    return <OrbitControls camera={camera}/>
})