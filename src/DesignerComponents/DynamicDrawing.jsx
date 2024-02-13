import React, { useRef, useState, useEffect } from 'react';
import { useThree, useFrame } from '@react-three/fiber';
import { Vector3 } from 'three';

export default function DynamicDrawing() {
  const [vertices, setVertices] = useState([]);
  const [tempVertex, setTempVertex] = useState(null);
  const { pointer, camera, raycaster } = useThree();
  const planeRef = useRef();

  useEffect(() => {
    // Convert mouse coordinates to 3D space
    const updateTempVertex = (event) => {
      raycaster.setFromCamera(pointer, camera);
      const intersects = raycaster.intersectObject(planeRef.current);
      if (intersects.length > 0) {
        const point = intersects[0].point;
        setTempVertex([point.x, point.y, point.z]);
      }
    };

    // Add the current tempVertex to the vertices array
    const addVertex = (event) => {
      if (tempVertex) {
        setVertices(v => [...v, tempVertex]);
        setTempVertex(null); // Reset tempVertex after adding
      }
    };

    window.addEventListener('mousemove', updateTempVertex);
    window.addEventListener('click', addVertex); // Consider changing to a more specific element or condition

    return () => {
      window.removeEventListener('mousemove', updateTempVertex);
      window.removeEventListener('click', addVertex);
    };
  }, [tempVertex, pointer, camera, raycaster]); // Update dependencies as needed

  return (
    <>
      <mesh
        ref={planeRef}
        position={[0, 0, 0]} // Adjust position as needed
      >
        <planeGeometry args={[100, 100]} />
        <meshStandardMaterial color="lightblue" opacity={0.5} transparent />
      </mesh>
      {vertices.length > 0 && <DynamicPolygon vertices={vertices} tempVertex={tempVertex} />}
    </>
  );
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
      <lineBasicMaterial color="red"  />
    </line>
  );
}
