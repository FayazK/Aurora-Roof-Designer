import {Vector3} from "three";
import {memo} from "react";

export const SceneLighting = memo(() => (
    <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
    </>
));

export const isCloseToFirstVertex = (vertex, firstVertex) => {
    if (!Array.isArray(vertex) || !Array.isArray(firstVertex)) {
        return false;
    }
    const distance = new Vector3(...vertex).distanceToSquared(new Vector3(...firstVertex));
    return distance < 0.1; // Use distanceToSquared to avoid the sqrt calculation, adjust sensitivity as needed
}