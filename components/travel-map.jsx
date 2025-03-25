"use client"

import { useState } from "react"
import { useTravelLog } from "@/components/travel-log-provider"
import { MapContainer, TileLayer, Marker, Popup, CircleMarker } from "react-leaflet"
import "leaflet/dist/leaflet.css"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"

// Import Leaflet for custom icons
import L from "leaflet"

// Custom Marker Icon
const customIcon = new L.Icon({
  iconUrl: "/custom-marker.png", // Replace with an actual marker image
  iconSize: [40, 40], // Bigger marker for better visibility
  iconAnchor: [20, 40], // Center of the marker
  popupAnchor: [0, -40], // Popup appears above the marker
})

export function TravelMap() {
  const { entries } = useTravelLog()
  const [selectedEntry, setSelectedEntry] = useState(null)

  if (entries.length === 0) {
    return (
      <div style={{ textAlign: "center", padding: "3rem" }}>
        <div style={{ background: "#f3f4f6", padding: "1rem", borderRadius: "50%", display: "inline-block" }}>
          <svg style={{ height: "2rem", width: "2rem", color: "#9ca3af" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 20l-5.447-2.724A1 1 0 013 16.382V5.618a1 1 0 011.447-.894L9 7m0 13l6-3m-6 3V7m6 10l4.553 2.276A1 1 0 0021 18.382V7.618a1 1 0 00-.553-.894L15 4m0 13V4m0 0L9 7"
            />
          </svg>
        </div>
        <h3 style={{ fontSize: "1.25rem", fontWeight: "600", marginTop: "1rem" }}>No travel entries yet</h3>
        <p style={{ color: "#6b7280", maxWidth: "30rem", margin: "auto" }}>Add your first travel destination to see it on the map.</p>
      </div>
    )
  }

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} style={{ position: "relative", paddingBottom: "2rem" }}>
      <Card style={{ overflow: "hidden", position: "relative" }}>
        <MapContainer
          center={[20, 0]} // Default center
          zoom={2}
          scrollWheelZoom={true}
          style={{ height: "500px", width: "100%", borderRadius: "0.5rem", zIndex: 0 }}
        >
          {/* OpenStreetMap Tiles (No API key needed) */}
          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

          {/* Add Markers for Each Travel Entry */}
          {entries.map((entry) => (
            <Marker
              key={entry.id}
              position={[entry.coordinates.lat, entry.coordinates.lng]}
              icon={customIcon}
              eventHandlers={{
                click: () => setSelectedEntry(entry),
              }}
            >
              <Popup autoPan={true} style={{ zIndex: 1000 }}>
                <div style={{ fontWeight: "bold", fontSize: "1rem" }}>{entry.destination}</div>
                <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                  {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
                </p>
                {entry.notes && <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>{entry.notes}</p>}
              </Popup>
            </Marker>
          ))}

          {/* Add Circle Markers for Better Visibility */}
          {entries.map((entry) => (
            <CircleMarker
              key={`circle-${entry.id}`}
              center={[entry.coordinates.lat, entry.coordinates.lng]}
              radius={10} // Adjust size
              color="#ff0000" // Red border
              fillColor="#ff4d4d" // Light red fill
              fillOpacity={0.9}
              style={{ zIndex: 999 }}
            />
          ))}
        </MapContainer>
      </Card>

      {/* Floating Details Panel for Selected Entry */}
      {selectedEntry && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          style={{
            position: "absolute",
            bottom: "1rem",
            left: "1rem",
            right: "1rem",
            backgroundColor: "white",
            padding: "1rem",
            borderRadius: "0.5rem",
            boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.2)",
            border: "1px solid #e5e7eb",
            zIndex: 50,
          }}
        >
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start" }}>
            <div>
              <h3 style={{ fontWeight: "bold" }}>{selectedEntry.destination}</h3>
              <p style={{ fontSize: "0.875rem", color: "#6b7280" }}>
                {formatDate(selectedEntry.startDate)} - {formatDate(selectedEntry.endDate)}
              </p>
            </div>
            <button onClick={() => setSelectedEntry(null)} style={{ background: "none", border: "none", cursor: "pointer" }}>
              <svg style={{ height: "1rem", width: "1rem", color: "#6b7280" }} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          {selectedEntry.notes && <p style={{ fontSize: "0.875rem", marginTop: "0.5rem" }}>{selectedEntry.notes}</p>}
        </motion.div>
      )}
    </motion.div>
  )
}
