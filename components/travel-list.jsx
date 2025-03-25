"use client"

import { useTravelLog } from "@/components/travel-log-provider"
import { TravelCard } from "@/components/travel-card"
import { motion } from "framer-motion"
import { MapPin } from "lucide-react"

export function TravelList() {
  const { entries } = useTravelLog()

  if (entries.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="bg-muted rounded-full p-4 mb-4">
          <MapPin className="h-8 w-8 text-muted-foreground" />
        </div>
        <h3 className="text-xl font-semibold mb-2">No travel entries yet</h3>
        <p className="text-muted-foreground max-w-md">
          Add your first travel destination by clicking the "Add Trip" button above.
        </p>
      </div>
    )
  }

  return (
    <motion.div
      className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ staggerChildren: 0.1 }}
    >
      {entries
        .sort((a, b) => new Date(b.startDate) - new Date(a.startDate))
        .map((entry, index) => (
          <TravelCard key={entry.id} entry={entry} index={index} />
        ))}
    </motion.div>
  )
}

