import React, {useRef, useState, useEffect, useCallback} from 'react';
import {useThree} from '@react-three/fiber';
import {useRecoilState} from "recoil";
import {produce} from "immer";
import {currentVertexAtom, drawingAtom, polygonsAtom} from "../../helpers/atoms.js";
import {DynamicPolygon, isCloseToFirstVertex} from "./DynamicPolygon.jsx";

export default function DynamicDrawing() {
    const [polygons, setPolygons] = useRecoilState(polygonsAtom);
    const [tempPoly, setTempPoly] = useState([]);
    const [tempVertex, setTempVertex] = useState([]);
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const [selectedVertex, setSelectedVertex] = useRecoilState(currentVertexAtom);
    const {pointer, camera, raycaster, gl} = useThree();
    const planeRef = useRef();

    useEffect(() => {
        if (!selectedVertex) {
            return;
        }
        const {polygonIndex, vertexIndex, x, y} = selectedVertex;
        // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
        const canvasX = (x / gl.domElement.width) * 2 - 1;
        const canvasY = -(y / (gl.domElement.height + 120)) * 2 + 1;

        // Update only if necessary to minimize setting values
        if (pointer.x !== canvasX || pointer.y !== canvasY) {
            pointer.x = canvasX;
            pointer.y = canvasY;

            // Update the picking ray with the camera and mouse position
            raycaster.setFromCamera(pointer, camera);

            // Calculate objects intersecting the picking ray
            const intersects = raycaster.intersectObject(planeRef.current);

            if (intersects.length > 0) {
                // The first intersection point is the new position in world coordinates
                const point = intersects[0].point;

                setPolygons(currentPolygons => produce(currentPolygons, draft => {
                    draft[polygonIndex][vertexIndex] = point.toArray();
                }));
            }
        }
        return () => {
            setSelectedVertex(null);
        }
    }, [selectedVertex]);

    const updateTempVertex = useCallback(() => {
        raycaster.setFromCamera(pointer, camera);
        if (planeRef.current) {
            const intersects = raycaster.intersectObject(planeRef.current);
            if (intersects.length > 0) {
                const point = intersects[0].point;
                setTempVertex([point.x, point.y, point.z]);
            }
        }
    }, [pointer, camera, raycaster]);

    const commitPolygon = useCallback(() => {
        if (tempPoly.length > 0) {
            setPolygons(p => [...p, tempPoly]);
            setTempVertex([]);
            setTempPoly([]);
        }
    }, [tempPoly, setPolygons]);// commitPolygon

    const finalizeVertex = useCallback(() => {
        // Logic that doesn't directly update state but decides if an update is needed
        const shouldFinalize = tempVertex && tempVertex.length === 3;
        const shouldClosePolygon = shouldFinalize && isCloseToFirstVertex(tempVertex, tempPoly[0]) && tempPoly.length > 2;

        if (shouldFinalize && !shouldClosePolygon) {
            setTempPoly(prevTempPoly => [...prevTempPoly, tempVertex]);
        }

        if (shouldClosePolygon) {
            // Deferring the setIsDrawing update to avoid warning
            setTimeout(() => setIsDrawing(false), 0);
        }
    }, [tempVertex, tempPoly, setIsDrawing]);


    useEffect(() => {
        const canvas = gl.domElement;

        if (isDrawing) {
            canvas.addEventListener('mousemove', updateTempVertex);
            canvas.addEventListener('click', finalizeVertex);
        } else {
            commitPolygon();
        }

        return () => {
            canvas.removeEventListener('mousemove', updateTempVertex);
            canvas.removeEventListener('click', finalizeVertex);
        };
    }, [isDrawing, updateTempVertex, finalizeVertex, commitPolygon, gl.domElement]);

    // Effect to reset tempPoly and tempVertex when starting a new drawing
    useEffect(() => {
        if (!isDrawing) {
            setTempPoly([]);
            setTempVertex([]);
        }
    }, [isDrawing]);

    return (<>
        <mesh ref={planeRef} position={[0, 0, 0]}>
            <planeGeometry args={[100, 100]}/>
            <meshStandardMaterial color="black"/>
        </mesh>
        {polygons.map((vertices, index) => (
            <DynamicPolygon key={'poly-'.index} polygonIndex={index} vertices={vertices}/>))}
        {(isDrawing && tempPoly.length) &&
            <DynamicPolygon vertices={tempPoly} tempVertex={tempVertex} key={`tmp-vertex`}/>}
    </>);
}// DynamicDrawing
