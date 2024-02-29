import { Suspense } from 'react';
import {GoogleMap, useJsApiLoader} from "@react-google-maps/api";
import {Canvas} from "@react-three/fiber";

const MapWithThreeFiberOverlay = () => {
    const mapContainerStyle = { width: '100%', height: '100vh' };
    const center = { lat: -34.397, lng: 150.644 }; // Example coordinates, replace with your desired location

    const { isLoaded } = useJsApiLoader({
        googleMapsApiKey: "YOUR_API_KEY" // Replace with your API key
    });

    const handleOverlayCanvas = (map) => {
        // Create an OverlayView instance
        const overlay = new window.google.maps.OverlayView();

        // Implement the onAdd function
        overlay.onAdd = function () {
            // Use this.getPanes() to access the map's panes
            const panes = this.getPanes();

            // Create a div to hold your Three.js canvas
            const div = document.createElement('div');
            div.style.position = 'absolute';

            // Append your Three.js canvas to the overlay layer
            panes.overlayLayer.appendChild(div);

            // You now need to create and append your Three.js canvas to this div
            // You can use React Three Fiber's Canvas component for this purpose
            ReactDOM.render(
                <Suspense fallback={null}>
                    <Canvas>
                        <ThreeContent />
                    </Canvas>
                </Suspense>,
            );
        };

        // Implement the draw function to update the position of the Three.js canvas
        overlay.draw = function () {
            // Update the position of the div based on the geographical location
            const point = this.getProjection().fromLatLngToDivPixel(new window.google.maps.LatLng(center));

            // Align the Three.js canvas with the map projection
            // You'll need to adjust the positioning based on your specific needs
            const div = this.getPanes().overlayLayer.firstChild;
            div.style.left = `${point.x}px`;
            div.style.top = `${point.y}px`;
        };

        // Add the overlay to the map
        overlay.setMap(map);
    };

    // Your Three.js content
    const ThreeContent = () => {
        // Define your 3D objects here
        return null; // Placeholder
    };

    if (!isLoaded) {
        return <div>Loading...</div>;
    }

    return (
        <GoogleMap
            mapContainerStyle={mapContainerStyle} center={center}
            zoom={8}
            onLoad={handleOverlayCanvas}
            ref={mapRef}
        >
            {/* Other map components can go here */}
        </GoogleMap>
    );
};

// Defining the component that will be rendered inside the Three.js Canvas
const ThreeContent = () => {
    // This is where you define your Three.js scene, objects, lights, and so on.
    // For example, you could create a simple spinning mesh here:
    return (
        <mesh>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'orange'} />
        </mesh>
    );
};

