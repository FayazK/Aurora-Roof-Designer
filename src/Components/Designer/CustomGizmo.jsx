import {useRef} from 'react';
import {extend, useThree, useFrame} from '@react-three/fiber';
import {Sprite as ThreeSprite, BoxGeometry, MeshBasicMaterial, Mesh} from 'three';
import {Text} from "@react-three/drei";

// Extend will make Sprite available as a JSX element called sprite for us to use.
extend({ThreeSprite});

const LabelSprite = ({label, position}) => {
    const spriteRef = useRef();

    // Update sprite position every frame
    useFrame(({camera}) => {
        if (spriteRef.current) {
            spriteRef.current.position.copy(position);
            spriteRef.current.quaternion.copy(camera.quaternion); // this makes the sprite always face the camera
        }
    });

    return (<Text
        ref={spriteRef}
        position={position}
        fontSize={0.5} // Adjust font size as needed
        color="#000000" // Text color
        anchorX="center"
        anchorY="middle"
    >
        {label}
    </Text>);
};

export const CustomGizmo = () => {
    // Cube size
    const size = 20;

    // Material for the cube (wireframe)
    const cubeMaterial = new MeshBasicMaterial({color: 'yellow', wireframe: true});

    // Geometry for the cube
    const cubeGeometry = new BoxGeometry(size, size, size);

    // Create a mesh with the geometry and material
    const cubeMesh = new Mesh(cubeGeometry, cubeMaterial);

    // Cube will be added directly to the scene, so we don't return it from the component
    const {scene} = useThree();
    scene.add(cubeMesh);

    // Positions for the labels
    const labelPositions = {
        Top: [0, size / 2, 0],
        Bottom: [0, -size / 2, 0],
        Left: [-size / 2, 0, 0],
        Right: [size / 2, 0, 0],
        Front: [0, 0, size / 2],
        Back: [0, 0, -size / 2],
    };

    // Render the labels using our LabelSprite component
    return (<>
        {Object.entries(labelPositions).map(([key, value]) => (<LabelSprite key={key} label={key} position={value}/>))}
    </>);
};