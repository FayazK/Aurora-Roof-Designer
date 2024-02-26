import React, {useRef, useState, useEffect, useCallback} from 'react';
import {useThree} from '@react-three/fiber';
import {useRecoilState} from "recoil";
import {currentVertexAtom, drawingAtom, polygonsAtom} from "../helpers/atom";
import {DynamicPolygon, isCloseToFirstVertex} from "../3dComponents/DynamicPolygon";

export default function DynamicDrawing() {
    const [polygons, setPolygons] = useRecoilState(polygonsAtom);
    const [tempPoly, setTempPoly] = useState([]);
    const [tempVertex, setTempVertex] = useState([]);
    const [isDrawing, setIsDrawing] = useRecoilState(drawingAtom);
    const [selectedVertex, setSelectedVertex] = useRecoilState(currentVertexAtom);
    const {pointer, camera, raycaster, gl} = useThree();
    const planeRef = useRef();

    useEffect(() => {
        const handleMouseMove = (event) => {
            if (selectedVertex) {
                // Calculate mouse position in normalized device coordinates (-1 to +1) for both components
                pointer.x = (event.clientX / window.innerWidth) * 2 - 1;
                pointer.y = -(event.clientY / window.innerHeight) * 2 + 1;

                // Update the picking ray with the camera and mouse position
                raycaster.setFromCamera(pointer, camera);

                // Calculate objects intersecting the picking ray. Assume 'planeRef' is a ref to a PlaneBufferGeometry
                const intersects = raycaster.intersectObject(planeRef.current);

                if (intersects.length > 0) {
                    // The first intersection point is the new position in world coordinates
                    const point = intersects[0].point;

                    setPolygons(poly => {
                        let newPoly = JSON.parse(JSON.stringify(poly)); // Deep copy of the state
                        newPoly[selectedVertex.polygonIndex][selectedVertex.vertexIndex] = point.toArray();
                        return newPoly;
                    })
                }
            }
        }

        window.addEventListener('mousemove', handleMouseMove);

        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [selectedVertex,camera,pointer,raycaster,setPolygons]);

    useEffect(() => {
        const handleMouseUp = () => {
            setSelectedVertex(null);
        };

        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [setSelectedVertex]);

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
            // Check if the last vertex is a duplicate of the first vertex
            const isDuplicate = tempPoly[0].x === tempPoly[tempPoly.length - 1].x &&
                tempPoly[0].y === tempPoly[tempPoly.length - 1].y &&
                tempPoly[0].z === tempPoly[tempPoly.length - 1].z;

            // If it's a duplicate, remove the last vertex before adding to polygons
            const newPoly = isDuplicate ? tempPoly.slice(0, -1) : tempPoly;

            setPolygons(p => [...p, newPoly]);
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
        {polygons.map((vertices, index) => (<DynamicPolygon key={index} polygonIndex={index} vertices={vertices}/>))}
        {(isDrawing && tempPoly.length) && <DynamicPolygon vertices={tempPoly} tempVertex={tempVertex}/>}
    </>);
}// DynamicDrawing
