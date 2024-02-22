import React, {useRef, useState, useEffect} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {Vector3} from 'three';
import {useRecoilState} from "recoil";
import {drawingAtom} from "../helpers/atom";

export default function DynamicDrawing() {
    const [vertices, setVertices] = useState([]);
    const [tempVertex, setTempVertex] = useState(null);
    const {pointer, camera, raycaster} = useThree();
    const planeRef = useRef();
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);

    // Centralize event listener management
    const updateTempVertex = (event) => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            setTempVertex([point.x, point.y, point.z]);
        }
    }

    const addVertex = (event) => {
        if (tempVertex) {
            setVertices(v => [...v, tempVertex]);
            setTempVertex(null); // Reset tempVertex after adding
        }
    };

    // Dedicated functions for managing listeners
    const startDrawing = () => {
        window.addEventListener('mousemove', updateTempVertex);
        window.addEventListener('click', addVertex);
    }

    const stopDrawing = () => {
        window.removeEventListener('mousemove', updateTempVertex);
        window.removeEventListener('click', addVertex);
    }

    useEffect(() => {
        if (isDrawing) {
            startDrawing();
        } else {
            stopDrawing();
        }

        // Cleanup function to ensure no listeners are left behind
        return stopDrawing;
    }, [isDrawing, tempVertex]); // Simplified dependency array

    return (<>
        <mesh
            ref={planeRef}
            position={[0, 0, 0]}
        >
            <planeGeometry args={[100, 100]}/>
            <meshStandardMaterial color="lightblue" opacity={0.5} transparent/>
        </mesh>
        {vertices.length > 0 && <DynamicPolygon vertices={vertices} tempVertex={tempVertex}/>}
    </>);
}

function DynamicPolygon({vertices, tempVertex}) {
    const lineRef = useRef();

    useFrame(() => {
        if (lineRef.current) {
            const points = vertices.map(v => new Vector3(...v));
            if (tempVertex) {
                points.push(new Vector3(...tempVertex));
            }
            lineRef.current.geometry.setFromPoints(points);
        }
    });

    return (<line ref={lineRef}>
        <bufferGeometry attach="geometry"/>
        <lineBasicMaterial color="red"/>
    </line>);
}
