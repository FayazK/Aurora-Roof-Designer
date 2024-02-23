import {useRef} from "react";
import {useFrame} from "@react-three/fiber";
import {Vector3} from "three";
import {dd} from "../helpers/logger";

export function DynamicPolygon({vertices, tempVertex}) {
    dd('DynamicPolygon', vertices, tempVertex)
    const lineRef = useRef();

    useFrame(() => {
        if (lineRef.current) {
            const points = (Array.isArray(vertices) ? vertices : []).map(v => {
                if (Array.isArray(v)) {
                    return new Vector3(...v)
                }
                //return []
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

export const isCloseToFirstVertex = (vertex, firstVertex) => {
    if (!Array.isArray(vertex) || !Array.isArray(firstVertex)) {
        return false;
    }
    const distance = new Vector3(...vertex).distanceTo(new Vector3(...firstVertex));
    return distance < 0.5; // Adjust sensitivity as needed
}// isCloseToFirstVertex