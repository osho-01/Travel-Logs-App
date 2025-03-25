"use client"

import { useEffect, useState, useCallback, useMemo } from "react"
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet"
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

// Component to handle map center and zoom
function MapController({ entries }) {
  const map = useMap()

  useEffect(() => {
    if (entries.length > 0) {
      try {
        // Create bounds from all entries
        const bounds = L.latLngBounds(entries.map((entry) => [entry.coordinates.lat, entry.coordinates.lng]))

        // Fit map to bounds with padding
        map.fitBounds(bounds, { padding: [50, 50], maxZoom: 10 })
      } catch (error) {
        console.error("Error fitting bounds:", error)
        // Fallback to default view
        map.setView([20, 0], 2)
      }
    } else {
      // Default view if no entries
      map.setView([20, 0], 2)
    }
  }, [entries, map])

  return null
}

// Component to handle theme changes
function ThemeController() {
  const { theme } = useTheme()

  useEffect(() => {
    if (theme === "dark") {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [theme])

  return null
}

export default function MapComponent({ entries, onSelectEntry }) {
  const [mounted, setMounted] = useState(false)
  const { theme } = useTheme()
  const isDark = theme === "dark"

  // Ensure component is mounted to avoid hydration issues
  useEffect(() => {
    setMounted(true)
  }, [])

  // Memoize the click handler to prevent infinite loops
  const handleMarkerClick = useCallback(
    (entry) => {
      onSelectEntry(entry)
    },
    [onSelectEntry],
  )

  // Memoize tile layer to prevent unnecessary re-renders
  const tileLayerUrl = useMemo(() => {
    return isDark
      ? "https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png"
      : "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
  }, [isDark])

  const attribution = useMemo(() => {
    return isDark
      ? '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>'
      : '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
  }, [isDark])

  if (!mounted) return null

  return (
    <MapContainer
      center={[20, 0]}
      zoom={2}
      style={{ height: "100%", width: "100%" }}
      scrollWheelZoom={true}
      attributionControl={true}
      zoomControl={true}
    >
      <TileLayer url={tileLayerUrl} attribution={attribution} maxZoom={19} />

      {entries.map((entry) => (
        <Marker
          key={entry.id}
          position={[entry.coordinates.lat, entry.coordinates.lng]}
          icon={createLeafletIcon("hsl(var(--primary))")}
          eventHandlers={{
            click: () => handleMarkerClick(entry),
          }}
        >
          <Popup>
            <div className="text-sm">
              <strong>{entry.destination}</strong>
            </div>
          </Popup>
        </Marker>
      ))}

      <MapController entries={entries} />
      <ThemeController />
    </MapContainer>
  )
}

