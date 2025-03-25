"use client"

import { useTravelLog } from "@/components/travel-log-provider"
import { formatDate } from "@/lib/utils"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Edit, Trash2, MapPin, Calendar } from "lucide-react"
import { motion } from "framer-motion"
import Image from "next/image"

export function TravelCard({ entry, index }) {
  const { openEditEntryModal, openDeleteDialog } = useTravelLog()

  return (
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
            onClick={() => openDeleteDialog(entry.id)}
            className="text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4 mr-2" />
            Delete
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
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

