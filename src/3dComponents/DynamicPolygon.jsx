import {useRef, useMemo} from "react";
import {useFrame} from "@react-three/fiber";
import {Vector3} from "three";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {currentVertexAtom, drawingAtom} from "../helpers/atom";

export function DynamicPolygon({vertices, tempVertex, polygonIndex}) {
    const lineRef = useRef();
    const isDrawing = useRecoilValue(drawingAtom)
    const setCurrentVertex = useSetRecoilState(currentVertexAtom)

    // Memoize points transformation
    const points = useMemo(() => {
        const transformedVertices = (Array.isArray(vertices) ? vertices : []).map(v => Array.isArray(v) ? new Vector3(...v) : null).filter(v => v !== null); // Filter out invalid vertices

        // Only push tempVertex if it's a valid array of numbers
        if (tempVertex && Array.isArray(tempVertex) && tempVertex.length === 3) {
            transformedVertices.push(new Vector3(...tempVertex));
        }

        return transformedVertices;
    }, [vertices, tempVertex]); // Depend on vertices and tempVertex

    useFrame(() => {
        if (lineRef.current) {
            lineRef.current.geometry.setFromPoints(points);
        }
    }, [points])

    const handleVertexClick = (polygonIndex, vertex, index) => {
        if (!isDrawing) {
            setCurrentVertex({polygonIndex: polygonIndex, vertexIndex: index, vertex: vertex});
        }
    }

    return (<group>
        <line ref={lineRef}>
            <bufferGeometry attach="geometry"/>
            <lineBasicMaterial color="red"/>
        </line>
        {vertices.map((vertex, idx) => (<mesh
            key={idx}
            position={new Vector3(...vertex)}
            onClick={() => handleVertexClick(polygonIndex, vertex, idx)}
        >
            <sphereGeometry args={[0.03, 32, 32]}/>
            <meshBasicMaterial color="white"/>
        </mesh>))}
        {tempVertex && (<mesh position={new Vector3(...tempVertex)}>
            <sphereGeometry args={[0.03, 32, 32]}/>
            <meshBasicMaterial color="white"/>
        </mesh>)}
    </group>);
}

export const isCloseToFirstVertex = (vertex, firstVertex) => {
    if (!Array.isArray(vertex) || !Array.isArray(firstVertex)) {
        return false;
    }
    const distance = new Vector3(...vertex).distanceToSquared(new Vector3(...firstVertex));
    return distance < 0.25; // Use distanceToSquared to avoid the sqrt calculation, adjust sensitivity as needed
}
