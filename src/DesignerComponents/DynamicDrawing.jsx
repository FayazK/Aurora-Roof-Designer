import React, {useRef, useState, useEffect, useCallback} from 'react';
import {useThree} from '@react-three/fiber';
import {useRecoilState} from "recoil";
import {drawingAtom, polygonsAtom} from "../helpers/atom";
import {DynamicPolygon, isCloseToFirstVertex} from "../3dComponents/DynamicPolygon";

export default function DynamicDrawing() {
    const [polygons, setPolygons] = useRecoilState(polygonsAtom);
    const [tempPoly, setTempPoly] = useState([]);
    const [tempVertex, setTempVertex] = useState([]);
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const {pointer, camera, raycaster, gl} = useThree();
    const planeRef = useRef();

    const updateTempVertex = useCallback(() => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            setTempVertex([point.x, point.y, point.z]);
        }
    }, [pointer, camera, raycaster]);// updateTempVertex

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

        if (shouldFinalize) {
            setTempPoly(prevTempPoly => [...prevTempPoly, shouldClosePolygon ? prevTempPoly[0] : tempVertex]);
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
        {polygons.map((vertices, index) => (<DynamicPolygon key={index} vertices={vertices}/>))}
        {(isDrawing && tempPoly.length) && <DynamicPolygon vertices={tempPoly} tempVertex={tempVertex}/>}
    </>);
}// DynamicDrawing
