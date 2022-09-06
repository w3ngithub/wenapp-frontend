import React from "react";
import { MapContainer, Popup, TileLayer, Marker, Tooltip } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

delete L.Icon.Default.prototype._getIconUrl;

L.Icon.Default.mergeOptions({
	iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
	iconUrl: require("leaflet/dist/images/marker-icon.png"),
	shadowUrl: require("leaflet/dist/images/marker-shadow.png")
});

function Map({ position, name }) {
	return (
		<MapContainer
			center={position}
			zoom={14}
			scrollWheelZoom={false}
			style={{ height: "100vh", width: "100wh" }}
		>
			<TileLayer
				attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
				url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
			/>
			<Marker position={position}>
				<Popup>{name}</Popup>
				<Tooltip>{name}</Tooltip>
			</Marker>
		</MapContainer>
	);
}

export default Map;
