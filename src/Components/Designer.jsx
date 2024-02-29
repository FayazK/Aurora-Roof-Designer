import {Suspense} from "react";
import {Card} from "antd";
import GoogleMapWithThree from "./GoogleMaps/GoogleMapWithThree.jsx";


export default function Designer() {

    return (<div style={{width: '100vw', height: 'calc(100vh - 60px)'}}>
        <Suspense fallback={<Card>Loading 3D Content...</Card>}>
            <GoogleMapWithThree/>
        </Suspense>
    </div>)
}// Designer
