"use client"

import { useEffect, useState, useCallback } from "react"
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet"
import { useTheme } from "next-themes"
import L from "leaflet"
import "leaflet/dist/leaflet.css"

// Fix Leaflet icon issues
const createLeafletIcon = (color) => {
  return L.divIcon({
    className: "custom-marker",
    html: `<div class="marker-pin" style="background-color: ${color};"></div>`,
    iconSize: [30, 30],
    iconAnchor: [15, 30],
    popupAnchor: [0, -30],
  })
}

// Component to handle map clicks
function LocationMarker({ position, setPosition }) {
  const map = useMapEvents({
    click(e) {
      setPosition(e.latlng)
      map.flyTo(e.latlng, map.getZoom())
    },
  })

  return position ? <Marker position={position} icon={createLeafletIcon("hsl(var(--primary))")} /> : null
}

// Component to handle theme changes
function ThemeController() {
  const { theme } = useTheme()
  const map = useMap()

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme, map])

  return null
}

export default function LocationPicker({ initialCoordinates, onSelect }) {
  const [position, setPosition] = useState(null)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Initialize position from props only once
  useEffect(() => {
    if (initialCoordinates && initialCoordinates.lat !== 0 && initialCoordinates.lng !== 0) {
      setPosition({ lat: initialCoordinates.lat, lng: initialCoordinates.lng })
    }
  }, []) // Empty dependency array to run only once on mount

  // Memoize the position change handler to prevent infinite loops
  const handlePositionChange = useCallback(
    (newPosition) => {
      setPosition(newPosition)
      if (newPosition) {
        onSelect({ lat: newPosition.lat, lng: newPosition.lng })
      }
    },
    [onSelect],
  )

  // Choose tile layer based on theme
  const tileLayer = isDark
    ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
    : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"

  const attribution = isDark
    ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
    : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'

  return (
    <div className="h-[300px] w-full rounded-md overflow-hidden border">
      <MapContainer
        center={position || [20, 0]}
        zoom={position ? 5 : 2}
        style={{ height: "100%", width: "100%" }}
        scrollWheelZoom={true}
      >
        <TileLayer url={tileLayer} attribution={attribution} maxZoom={19} />
        <LocationMarker position={position} setPosition={handlePositionChange} />
        <ThemeController />
      </MapContainer>
      <div className="bg-muted-foreground/10 p-2 text-xs font-medium">Click on the map to set your travel location</div>
    </div>
  )
}

