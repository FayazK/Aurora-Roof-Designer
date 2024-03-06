import {MapControls, OrbitControls} from "@react-three/drei";
import {MOUSE} from "three";
import {useRecoilValue} from "recoil";
import {topViewAtom} from "../../helpers/atoms.js";

export const ViewController = () => {
    const isTopView = useRecoilValue(topViewAtom);
    return <OrbitControls
        enabled={!isTopView}
        /*minDistance={1}
        maxDistance={40}*/
        zoomSpeed={.5}
        minPolarAngle={Math.PI / 2} // Restrict top view
        minAzimuthAngle={0} // Disable tilting to the left
        maxAzimuthAngle={0} // Disable tilting to the right
        mouseButtons={{
            LEFT: MapControls.NONE, MIDDLE: MOUSE.DOLLY, RIGHT: MOUSE.ROTATE
        }}
    />
}