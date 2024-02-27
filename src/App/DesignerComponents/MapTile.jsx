import {PlaneGeometry, TextureLoader} from "three";
import React, {useMemo} from "react";
import {useLoader} from "@react-three/fiber";

export const MapTile = ({imageUrl}) => {
    const texture = useLoader(TextureLoader, imageUrl);

    // Assuming the image is square, if not you need to adjust the plane dimensions
    const aspectRatio = texture.image ? texture.image.width / texture.image.height : 1;
    const planeSize = 10; // Size of the plane in the 3D world, adjust as needed

    const planeGeometry = useMemo(() => {
        return new PlaneGeometry(planeSize, planeSize / aspectRatio);
    }, [planeSize, aspectRatio]);

    return (<mesh>
        <primitive attach="geometry" object={planeGeometry}/>
        <meshBasicMaterial attach="material" map={texture}/>
    </mesh>);
}// MapTile
