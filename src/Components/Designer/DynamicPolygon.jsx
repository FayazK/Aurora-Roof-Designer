import {useRef, useMemo, Fragment} from "react";
import {useFrame} from "@react-three/fiber";
import {Vector3} from "three";
import {Text} from "@react-three/drei";
import {useRecoilValue, useSetRecoilState} from "recoil";
import {useDrag} from "react-use-gesture";
import {currentVertexAtom, drawingAtom} from "../../helpers/atoms.js";
import {calculateDistance} from "../../helpers/Formulas.js";

export const DynamicPolygon = ({vertices, tempVertex, polygonIndex}) => {
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

        // Close the loop if not drawing, to connect the last and the first vertex
        if (!isDrawing && transformedVertices.length > 0) {
            transformedVertices.push(transformedVertices[0]);
        }

        return transformedVertices;
    }, [vertices, tempVertex]); // Depend on vertices and tempVertex

    useFrame(() => {
        if (lineRef.current) {
            lineRef.current.geometry.setFromPoints(points);
        }
    }, [points])

    const bind = useDrag((props) => {
        if (!props.down || isDrawing) {
            setCurrentVertex(null);
            return;
        }
        const data = {
            polygonIndex,
            vertex: props.args[0],
            vertexIndex: props.args[1],
            x: props.event.clientX,
            y: props.event.clientY
        }
        setCurrentVertex(data);
    });

    return (<group>
        <line ref={lineRef}>
            <bufferGeometry attach="geometry"/>
            <lineBasicMaterial color="red"/>
        </line>
        {vertices.map((vertex, idx, array) => {
            const nextVertex = array[(idx + 1) % array.length]; // Get the next vertex, wrap around to the first vertex if necessary
            const midpoint = [(vertex[0] + nextVertex[0]) / 2, (vertex[1] + nextVertex[1]) / 2, (vertex[2] + nextVertex[2]) / 2]; // Calculate the midpoint
            const distance = calculateDistance(vertex, nextVertex); // Calculate the distance

            return (<Fragment key={'f-' + idx}>
                <mesh
                    key={idx}
                    position={new Vector3(...vertex)}
                    {...bind(vertex, idx)}
                >
                    <sphereGeometry args={[0.05, 32, 32]}/>
                    <meshBasicMaterial color="black" transparent={true} opacity={0.7}/>
                </mesh>
                <Text position={midpoint} fontSize={0.1} color={'black'}>
                    {distance.toFixed(2)}
                </Text>
            </Fragment>);
        })}
        {tempVertex && (<mesh position={new Vector3(...tempVertex)}>
            <sphereGeometry args={[0.05, 32, 32]}/>
            <meshBasicMaterial color="black" transparent={true} opacity={0.4} />
        </mesh>)}
    </group>);
}

