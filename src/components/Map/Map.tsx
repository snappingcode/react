import React, { } from 'react';
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';
import { styles } from '../../config';

interface MarkerProps {
    lat: number;
    lng: number;
    label?: string;
    icon?: string;
}

interface MapProps {
    apiKey: string;
    markers: MarkerProps[];
    zoom?: number;
    center?: { lat: number; lng: number };
    mapStyles?: google.maps.MapTypeStyle[];
    isDraggable?: boolean;

    onMapClick?: (coordinates: { lat: number; lng: number }) => void;
}

const defaultCenter = { lat: -34.6037, lng: -58.3816 }; // Buenos Aires, Argentina
const defaultZoom = 12;

const Map: React.FC<MapProps> = ({
    apiKey,
    markers = [],
    zoom = defaultZoom,
    center = defaultCenter,
    mapStyles = styles.googleMap,
    isDraggable = true,
    onMapClick,
}) => {
    const { isLoaded, loadError } = useLoadScript({
        googleMapsApiKey: apiKey,
    });
    if (loadError) return <div>Error loading maps</div>;
    if (!isLoaded) return <div>Loading maps...</div>;

    const handleMapClick = (event: google.maps.MapMouseEvent) => {
        if (onMapClick && event.latLng) {
            onMapClick({ lat: event.latLng.lat(), lng: event.latLng.lng() });
        }
    };

    return (
        <GoogleMap
            zoom={zoom}
            center={center}
            options={{
                styles: mapStyles,
                draggable: isDraggable,
            }}
            mapContainerStyle={{ width: '100%', height: '100%' }}
            onClick={handleMapClick}
        >
            {markers.map((marker, index) => (
                <Marker
                    key={index}
                    position={{ lat: marker.lat, lng: marker.lng }}
                    label={marker.label}
                    icon={marker.icon}
                />
            ))}
        </GoogleMap>
    );
};

export default Map;
