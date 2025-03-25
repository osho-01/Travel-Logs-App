"use client"

import { useEffect, useState } from "react"
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import L from "leaflet"

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "/custom-marker.png", // Replace with an actual marker image
  iconSize: [40, 40],
  iconAnchor: [20, 40],
  popupAnchor: [0, -40],
})

export default function ClientMap({ entries }) {
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return <p style={{ textAlign: "center", padding: "2rem" }}>Loading map...</p>

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      scrollWheelZoom={true}
      style={{ height: "500px", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
    >
      <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

      {entries.map((entry) => (
        <Marker key={entry.id} position={[entry.coordinates.lat, entry.coordinates.lng]} icon={customIcon}>
          <Popup autoPan={true} style={{ zIndex: 1000 }}>
            <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{entry.destination}</div>
            <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
              {new Date(entry.startDate).toLocaleDateString()} - {new Date(entry.endDate).toLocaleDateString()}
            </p>
            {entry.notes && <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>{entry.notes}</p>}
          </Popup>
        </Marker>
      ))}

      {/* Circle Markers for Better Visibility */}
      {entries.map((entry) => (
        <CircleMarker
          key={`circle-${entry.id}`}
          center={[entry.coordinates.lat, entry.coordinates.lng]}
          radius={10}
          color="#ff0000"
          fillColor="#ff4d4d"
          fillOpacity={0.9}
          style={{ zIndex: 999 }}
        />
      ))}
    </MapContainer>
  )
}
