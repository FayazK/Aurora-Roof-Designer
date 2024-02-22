import React, { useRef, useState, useEffect } from 'react';
import { useFrame, useThree } from '@react-three/fiber';
import { Vector3 } from 'three';
import { useRecoilState } from "recoil";
import { drawingAtom, polygonsAtom } from "../helpers/atom";

const isCloseToFirstVertex = (vertex, firstVertex) => {
    const distance = new Vector3(...vertex).distanceTo(new Vector3(...firstVertex));
    return distance < 0.5; // Adjust sensitivity as needed
};

export default function DynamicDrawing() {
    const [polygons, setPolygons] = useRecoilState(polygonsAtom);
    const [tempVertex, setTempVertex] = useState(null);
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const { pointer, camera, raycaster } = useThree();
    const planeRef = useRef();

    const updateTempVertex = (event) => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            setTempVertex([point.x, point.y, point.z]);
        }
    };

    const finalizeVertex = () => {
        if (tempVertex) {
            if (polygons.length === 0 || !isDrawing) {
                setPolygons([...polygons, [[...tempVertex]]]);
                setIsDrawing(true); // Start drawing
            } else {
                const lastPolygon = polygons[polygons.length - 1];
                if (isCloseToFirstVertex(tempVertex, lastPolygon[0])) {
                    setIsDrawing(false); // Close polygon and stop drawing
                    setTempVertex(null); // Clear temp vertex
                } else {
                    const newPolygons = [...polygons];
                    newPolygons[newPolygons.length - 1] = [...lastPolygon, [...tempVertex]];
                    setPolygons(newPolygons);
                }
            }
        }
    };

    useEffect(() => {
        window.addEventListener('mousemove', updateTempVertex);
        if (isDrawing) {
            window.addEventListener('click', finalizeVertex);
        } else {
            window.removeEventListener('click', finalizeVertex);
        }

        return () => {
            window.removeEventListener('mousemove', updateTempVertex);
            window.removeEventListener('click', finalizeVertex);
        };
    }, [isDrawing, tempVertex, polygons]);

    return (<>
        <mesh
            ref={planeRef}
            position={[0, 0, 0]}
        >
            <planeGeometry args={[100, 100]}/>
            <meshStandardMaterial color="lightblue" opacity={0.5} transparent/>
        </mesh>
        {polygons.map((vertices, index) => (
            <DynamicPolygon key={index} vertices={vertices} tempVertex={isDrawing && tempVertex} />
        ))}
    </>);
}


function DynamicPolygon({ vertices, tempVertex }) {
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

    return (
        <line ref={lineRef}>
            <bufferGeometry attach="geometry" />
            <lineBasicMaterial color="red" />
        </line>
    );
}
