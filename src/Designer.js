import { Canvas, useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';
import {useRef, useState} from "react";

function Polygon({ vertices }) {
    const lineRef = useRef();

    // Update line geometry on vertices change
    useFrame(() => {
        if (lineRef.current) {
            lineRef.current.geometry.setFromPoints(vertices.map(v => new Vector3(...v)));
        }
    });

    return (
        <line ref={lineRef}>
            <bufferGeometry attach="geometry" />
            <lineBasicMaterial color="black" />
        </line>
    );
}

export default function Designer() {
    const [vertices, setVertices] = useState([]);

    const onClick = (e) => {
        const { x, y, z } = e.point;
        setVertices([...vertices, [x, y, z]]);
    };

    return (
        <Canvas>
            <ambientLight intensity={0.5} />
            <pointLight position={[10, 10, 10]} />
            <mesh onClick={onClick}>
                <planeGeometry args={[100, 100]} />
                <meshStandardMaterial color="lightblue" opacity={0.5} transparent />
            </mesh>
            {vertices.length > 1 && <Polygon vertices={vertices} />}
        </Canvas>
    );
}
