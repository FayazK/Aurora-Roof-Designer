import React, {useRef, useState, useEffect} from 'react';
import {useThree} from '@react-three/fiber';
import {useRecoilState} from "recoil";
import {drawingAtom, polygonsAtom} from "../helpers/atom";
import {dd} from "../helpers/logger";
import {DynamicPolygon, isCloseToFirstVertex} from "../3dComponents/DynamicPolygon";

export default function DynamicDrawing() {
    const [polygons, setPolygons] = useRecoilState(polygonsAtom);
    const [tempPoly, setTempPoly] = useState([]);
    const [tempVertex, setTempVertex] = useState([]);
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const {pointer, camera, raycaster} = useThree();
    const planeRef = useRef();

    const updateTempVertex = () => {
        raycaster.setFromCamera(pointer, camera);
        const intersects = raycaster.intersectObject(planeRef.current);
        if (intersects.length > 0) {
            const point = intersects[0].point;
            setTempVertex([point.x, point.y, point.z]);
        }
    }// updateTempVertex

    const commitPolygon = () => {
        if (tempPoly.length > 0) {
            setPolygons(p => [...p, tempPoly]);
            setTempVertex([]);
            setTempPoly([]);
        }
    }// commitPolygon

    const finalizeVertex = () => {
        if (tempVertex && tempVertex.length === 3) {
            if (!tempPoly.length) {
                setTempPoly([tempVertex]);
                return;
            }
            setTempPoly([...tempPoly, tempVertex]);
            // Add tempVertex to the current polygon
            if (isCloseToFirstVertex(tempVertex, tempPoly[0]) && tempPoly.length > 2) {
                setIsDrawing(false);
            }
        }
    }// finalizeVertex

    const attachEvents = () => {
        window.addEventListener('mousemove', updateTempVertex);
        window.addEventListener('click', finalizeVertex);
    }// attachEvents

    const removeEvents = () => {
        window.removeEventListener('mousemove', updateTempVertex);
        window.removeEventListener('click', finalizeVertex);
    }// removeEvents

    useEffect(() => {
        if (isDrawing) {
            attachEvents()
        } else {
            removeEvents()
            commitPolygon();
        }

        return () => {
            removeEvents();
        }
    }, [isDrawing, tempVertex, tempPoly]);

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
        {(isDrawing && tempPoly.length) && <DynamicPolygon vertices={tempPoly} tempVertex={tempVertex}/>}
    </>);
}// DynamicDrawing
