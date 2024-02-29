import React, {useRef, useEffect, useState} from 'react';
import {GoogleMap, useJsApiLoader} from '@react-google-maps/api';
import {RecoilRoot, useRecoilValue} from "recoil";
import {mapCenterAtom} from "../../helpers/atoms.js";
import { createRoot } from 'react-dom/client';
import ThreeCanvas from "../Designer/ThreeCanvas.jsx";

const mapContainerStyle = {width: '100%', height: 'calc(100vh - 60px)'};
const center = {lat: 37.46697106434549, lng: -122.21422606806213};

const GoogleMapWithThree = () => {
    const mapRef = useRef(null);
    const googleMapCenter = useRecoilValue(mapCenterAtom)
    const [mapTilt, setMapTilt] = useState(0)

    const {isLoaded} = useJsApiLoader({
        googleMapsApiKey: 'AIzaSyAo1viD-Ut0TzXTyihevwuf-9tv_J3dPa0', // Replace with your API key
    });

    useEffect(() => {
        if (isLoaded && mapRef.current) {
            // Define the overlay
            const overlay = new window.google.maps.OverlayView();

            // Implement the onAdd function
            overlay.onAdd = function () {
                const panes = this.getPanes();
                const div = document.createElement('div');
                div.style.position = 'absolute';
                panes.overlayLayer.appendChild(div);

                // Use createRoot to render the Three.js canvas
                const root = createRoot(div); // Create a root.
                root.render(<RecoilRoot><ThreeCanvas /></RecoilRoot>); // Initial render
            };

            // Implement the draw function
            overlay.draw = function () {
                const point = this.getProjection().fromLatLngToDivPixel(new window.google.maps.LatLng(center));
                const div = this.getPanes().overlayLayer.firstChild;
                div.style.left = `${point.x}px`
                div.style.top = `${point.y}px`;
            };

            overlay.setMap(mapRef.current);
        }
    }, [isLoaded, mapRef]);

    return (isLoaded ? <GoogleMap
        mapContainerStyle={mapContainerStyle}
        center={googleMapCenter}
        zoom={21}
        tilt={mapTilt}
        mapTypeId={'satellite'}
        onLoad={(map) => {
            mapRef.current = map;
        }}
    >
        {/* Additional Google Map components or hooks can go here */}
    </GoogleMap> : null);
};

export default GoogleMapWithThree;
