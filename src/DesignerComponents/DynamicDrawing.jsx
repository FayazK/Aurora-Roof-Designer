import React, {useRef, useState, useEffect} from 'react';
import {useFrame, useThree} from '@react-three/fiber';
import {Vector3} from 'three';
import {useRecoilState} from "recoil";
import {drawingAtom, polygonsAtom} from "../helpers/atom";

const isCloseToFirstVertex = (vertex, firstVertex) => {
    console.log(vertex, firstVertex)
    if(!Array.isArray(vertex) || !Array.isArray(firstVertex)) {
        return false;
    }
    const distance = new Vector3(...vertex).distanceTo(new Vector3(...firstVertex));
    return distance < 0.5; // Adjust sensitivity as needed
};

export default function DynamicDrawing() {
    const [polygons, setPolygons] = useRecoilState(polygonsAtom);
    const [tempVertex, setTempVertex] = useState([]);
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const {pointer, camera, raycaster} = useThree();
    const planeRef = useRef();

    // Adjusted to handle polygon closure and new drawing initiation
    const updateTempVertex = (event) => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            setTempVertex([point.x, point.y, point.z]);
        }
    };

    const finalizeVertex = () => {
        // Ensure tempVertex is a complete vertex before attempting to add it
        if (tempVertex && Array.isArray(tempVertex) && tempVertex.length === 3) {
            if (polygons.length === 0 || !isDrawing) {
                // Start a new polygon with tempVertex as the first vertex
                setPolygons([[tempVertex]]);
                setIsDrawing(true);
            } else {
                // Add tempVertex to the current polygon
                const lastPolygon = polygons[polygons.length - 1];
                if (isCloseToFirstVertex(tempVertex, lastPolygon[0]) && lastPolygon.length > 2) {
                    // Close the polygon and stop drawing
                    setPolygons(p => [...p.slice(0, -1), [...lastPolygon, lastPolygon[0]]]);
                    setIsDrawing(false);
                    setTempVertex([]);
                } else {
                    // Add the new vertex to the current polygon
                    setPolygons(p => [...p.slice(0, -1), [...lastPolygon, tempVertex]]);
                }
            }
        }
    };// finalizeVertex

    useEffect(() => {
        if (isDrawing) {
            window.addEventListener('mousemove', updateTempVertex);
            window.addEventListener('click', finalizeVertex);
        } else {
            window.removeEventListener('mousemove', updateTempVertex);
            window.removeEventListener('click', finalizeVertex);
        }

        return () => {
            window.removeEventListener('mousemove', updateTempVertex);
            window.removeEventListener('click', finalizeVertex);
        };
    }, [isDrawing, tempVertex]);

    return (<>
        <mesh
            ref={planeRef}
            position={[0, 0, 0]}
        >
            <planeGeometry args={[100, 100]}/>
            <meshStandardMaterial color="black"/>
        </mesh>
        {polygons.map((vertices, index) => {
            return <DynamicPolygon key={index} vertices={vertices} tempVertex={isDrawing && tempVertex}/>
        })}
    </>);
}


function DynamicPolygon({vertices, tempVertex}) {
    const lineRef = useRef();

    useFrame(() => {
        if (lineRef.current) {
            const points = (Array.isArray(vertices) ? vertices : []).map(v => {
                if (Array.isArray(v)) {
                    return new Vector3(...v)
                }
                return []
            });
            // Only push tempVertex if it's a valid array of numbers
            if (tempVertex && Array.isArray(tempVertex) && tempVertex.length === 3) {
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


