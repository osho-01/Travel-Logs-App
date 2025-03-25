"use client"

import { useState, useEffect, useCallback } from "react"
import { useTravelLog } from "@/components/travel-log-provider"
import { Card } from "@/components/ui/card"
import { motion } from "framer-motion"
import { formatDate } from "@/lib/utils"
import { MapPin } from "lucide-react"
import dynamic from "next/dynamic"

// Dynamically import the map component to avoid SSR issues
const MapComponent = dynamic(() => import("@/components/map-component"), {
  ssr: false,
  loading: () => (
    <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

export function TravelMap() {
  const { entries } = useTravelLog()
  const [selectedEntry, setSelectedEntry] = useState(null)
  const [isMounted, setIsMounted] = useState(false)

  // Only run client-side
  useEffect(() => {
    setIsMounted(true)
  }, [])

  // Memoize the select entry handler to prevent infinite loops
  const handleSelectEntry = useCallback((entry) => {
    setSelectedEntry(entry)
  }, [])

  if (!isMounted) {
    return (
      <div className="h-[500px] w-full flex items-center justify-center bg-muted/20 rounded-md">
        <div className="animate-pulse flex flex-col items-center">
          <MapPin className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground">Loading map...</p>
        </div>
      </div>
    )
  }

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted rounded-full p-4 mb-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No travel entries yet</h3>
        <p className="text-muted-foreground max-w-md">Add your first travel destination to see it on the map.</p>
      </div>
    )
  }

  // Filter entries with valid coordinates
  const validEntries = entries.filter(
    (entry) => entry.coordinates && (entry.coordinates.lat !== 0 || entry.coordinates.lng !== 0),
  )

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="space-y-4">
      <Card className="overflow-hidden relative">
        <div className="h-[500px] w-full relative">
          <MapComponent entries={validEntries} onSelectEntry={handleSelectEntry} />

          {/* Selected entry popup */}
          {selectedEntry && (
            <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-72 bg-card p-4 rounded-lg shadow-lg border z-10">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-bold">{selectedEntry.destination}</h3>
                  <p className="text-sm text-muted-foreground">
                    {formatDate(selectedEntry.startDate)} - {formatDate(selectedEntry.endDate)}
                  </p>
                </div>
                <button onClick={() => setSelectedEntry(null)} className="text-muted-foreground hover:text-foreground">
                  <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              {selectedEntry.notes && <p className="mt-2 text-sm line-clamp-2">{selectedEntry.notes}</p>}
            </div>
          )}
        </div>
      </Card>

      <div className="text-sm text-muted-foreground text-center">
        {validEntries.length > 0 ? (
          <p>
            Showing {validEntries.length} location{validEntries.length !== 1 ? "s" : ""} on the map
          </p>
        ) : (
          <p>Add locations to your travel entries to see them on the map</p>
        )}
      </div>

      {/* List of locations as a fallback */}
      {validEntries.length > 0 && (
        <div className="mt-6">
          <h3 className="text-lg font-medium mb-3">Your Travel Locations</h3>
          <div className="grid gap-2">
            {validEntries.map((entry) => (
              <Card
                key={entry.id}
                className="p-3 cursor-pointer hover:bg-accent transition-colors"
                onClick={() => handleSelectEntry(entry)}
              >
                <div className="flex items-center gap-3">
                  <div className="bg-primary/10 p-2 rounded-full">
                    <MapPin className="h-4 w-4 text-primary" />
                  </div>
                  <div>
                    <h4 className="font-medium">{entry.destination}</h4>
                    <p className="text-xs text-muted-foreground">
                      {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      )}
    </motion.div>
  )
}

