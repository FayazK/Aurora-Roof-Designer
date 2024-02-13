import { Canvas } from '@react-three/fiber';
import DynamicDrawing from './DesignerComponents/DynamicDrawing'; // Assume this is your refactored component

export default function Designer() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} />
      <DynamicDrawing />
    </Canvas>
  );
}
