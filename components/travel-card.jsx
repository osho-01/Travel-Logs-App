"use client"

import { useState, useEffect } from "react"
import { useTravelLog } from "@/components/travel-log-provider"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MapPin, Calendar } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"

export function TravelCard({ entry, index }) {
  const { openEditEntryModal, deleteEntry } = useTravelLog()
  const [pendingDelete, setPendingDelete] = useState(null)

  useEffect(() => {
    if (pendingDelete !== null) {
      const timer = setTimeout(() => {
        deleteEntry(pendingDelete) // Delete entry after 4 sec
        setPendingDelete(null) // Clear pending delete state
      }, 4000)

      return () => clearTimeout(timer) // Cleanup timer if user clicks "Undo"
    }
  }, [pendingDelete, deleteEntry])

  const handleDelete = (id) => {
    setPendingDelete(id) // Set entry for deletion
  }

  const handleUndo = () => {
    setPendingDelete(null) // Cancel deletion
  }

  return (
    <>
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: index * 0.05 }}>
        <Card className="overflow-hidden h-full flex flex-col hover:shadow-md transition-shadow">
          <div className="relative h-48 w-full">
            {entry.images && entry.images.length > 0 ? (
              <Image src={entry.images[0] || "/placeholder.svg"} alt={entry.destination} fill className="object-cover" />
            ) : (
              <div className="h-full w-full bg-muted flex items-center justify-center">
                <MapPin className="h-12 w-12 text-muted-foreground opacity-50" />
              </div>
            )}
            <div className="absolute top-2 right-2">
              <Badge variant="secondary" className="font-medium">
                {formatTripDuration(entry.startDate, entry.endDate)}
              </Badge>
            </div>
          </div>
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-xl font-bold">{entry.destination}</h3>
                <div className="flex items-center text-sm text-muted-foreground mt-1">
                  <Calendar className="h-3.5 w-3.5 mr-1" />
                  <span>
                    {formatDate(entry.startDate)} - {formatDate(entry.endDate)}
                  </span>
                </div>
              </div>
            </div>
          </CardHeader>
          <CardContent className="flex-1">
            <p className="text-muted-foreground line-clamp-3">{entry.notes}</p>
          </CardContent>
          <CardFooter className="border-t pt-4 flex justify-between">
            <Button variant="outline" size="sm" onClick={() => openEditEntryModal(entry)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDelete(entry.id)}
              className="text-destructive hover:text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </Button>
          </CardFooter>
        </Card>
      </motion.div>

      {/* Toast Notification (Top-Right) */}
      <AnimatePresence>
        {pendingDelete === entry.id && (
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            className="fixed top-4 right-4 bg-white shadow-lg border border-red-400 p-4 rounded-lg flex items-center gap-4"
          >
            <span className="text-red-600">Entry will be deleted</span>
            <Button variant="outline" size="sm" onClick={handleUndo}>
              Undo
            </Button>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}

function formatTripDuration(startDate, endDate) {
  const start = new Date(startDate)
  const end = new Date(endDate)
  const diffTime = Math.abs(end - start)
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

  if (diffDays === 0) return "Day Trip"
  if (diffDays === 1) return "1 Day"
  if (diffDays < 7) return `${diffDays} Days`
  if (diffDays < 30) {
    const weeks = Math.floor(diffDays / 7)
    return `${weeks} ${weeks === 1 ? "Week" : "Weeks"}`
  }
  const months = Math.floor(diffDays / 30)
  return `${months} ${months === 1 ? "Month" : "Months"}`
}
