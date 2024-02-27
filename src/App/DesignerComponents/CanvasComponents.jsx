// Define a separate component for lighting to improve readability and reusability
import {memo} from "react";

export const SceneLighting = memo(() => (
    <>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
    </>
));