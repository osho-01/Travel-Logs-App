"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Calendar } from "@/components/ui/calendar"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { cn, formatDate } from "@/lib/utils"
import { CalendarIcon, MapPin, Upload, X } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import Image from "next/image"
import dynamic from "next/dynamic"

// Dynamically import the location picker to avoid SSR issues
const LocationPicker = dynamic(() => import("@/components/location-picker"), {
  ssr: false,
  loading: () => (
    <div className="h-[300px] w-full flex items-center justify-center bg-muted/20 rounded-md">
      <div className="animate-pulse flex flex-col items-center">
        <MapPin className="h-6 w-6 text-muted-foreground mb-2" />
        <p className="text-sm text-muted-foreground">Loading map...</p>
      </div>
    </div>
  ),
})

export function AddEntryModal({ isOpen, onClose, onSubmit }) {
  const [formData, setFormData] = useState({
    destination: "",
    startDate: new Date(),
    endDate: new Date(),
    notes: "",
    images: [],
    coordinates: { lat: 0, lng: 0 },
  })
  const [dateRange, setDateRange] = useState({
    from: new Date(),
    to: new Date(),
  })
  const [previewImages, setPreviewImages] = useState([])
  const [isMapOpen, setIsMapOpen] = useState(false)
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  const handleInputChange = useCallback((e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }, [])

  const handleImageUpload = useCallback(
    (e) => {
      const files = Array.from(e.target.files)
      if (files.length === 0) return

      const newImages = []
      const newPreviewImages = [...previewImages]

      files.forEach((file) => {
        const reader = new FileReader()
        reader.onload = (event) => {
          newImages.push(event.target.result)
          newPreviewImages.push({
            url: event.target.result,
            name: file.name,
          })

          if (newImages.length === files.length) {
            setFormData((prev) => ({
              ...prev,
              images: [...prev.images, ...newImages],
            }))
            setPreviewImages(newPreviewImages)
          }
        }
        reader.readAsDataURL(file)
      })
    },
    [previewImages],
  )

  const removeImage = useCallback((index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }, [])

  const handleDateRangeChange = useCallback((range) => {
    setDateRange(range)
    if (range?.from) {
      setFormData((prev) => ({ ...prev, startDate: range.from }))
    }
    if (range?.to) {
      setFormData((prev) => ({ ...prev, endDate: range.to }))
    }
  }, [])

  const handleLocationSelect = useCallback((coordinates) => {
    setFormData((prev) => ({
      ...prev,
      coordinates,
    }))
  }, [])

  const resetForm = useCallback(() => {
    setFormData({
      destination: "",
      startDate: new Date(),
      endDate: new Date(),
      notes: "",
      images: [],
      coordinates: { lat: 0, lng: 0 },
    })
    setDateRange({ from: new Date(), to: new Date() })
    setPreviewImages([])
    setIsMapOpen(false)
  }, [])

  const handleSubmit = useCallback(
    (e) => {
      e.preventDefault()
      onSubmit(formData)
      resetForm()
      onClose()
    },
    [formData, onSubmit, resetForm, onClose],
  )

  const toggleMap = useCallback(() => {
    setIsMapOpen((prev) => !prev)
  }, [])

  return (
    <Dialog open={isOpen}  onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto" style={{ zIndex: 10000  }} >
        <DialogHeader>
          <DialogTitle>Add New Travel Entry</DialogTitle>
          <DialogDescription>Fill in the details about your travel experience.</DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="destination">Destination</Label>
              <Input
                id="destination"
                name="destination"
                value={formData.destination}
                onChange={handleInputChange}
                placeholder="e.g., Paris, France"
                required
              />
            </div>

            <div className="grid gap-2">
              <Label>Travel Dates</Label>
              <Popover>
  <PopoverTrigger asChild>
    <Button
      variant="outline"
      className={cn("justify-start text-left font-normal", !dateRange.from && "text-muted-foreground")}
    >
      <CalendarIcon className="mr-2 h-4 w-4" />
      {dateRange.from ? (
        dateRange.to ? (
          <>
            {formatDate(dateRange.from)} - {formatDate(dateRange.to)}
          </>
        ) : (
          formatDate(dateRange.from)
        )
      ) : (
        <span>Select date range</span>
      )}
    </Button>
  </PopoverTrigger>
  <PopoverContent className="w-auto p-0" align="start" style={{ zIndex: 10001 }}>
    <Calendar
      mode="range"
      selected={dateRange}
      onSelect={handleDateRangeChange}
      fromDate={new Date()}  // ⬅️ Prevents selecting past dates
      initialFocus
    />
  </PopoverContent>
</Popover>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="notes">Notes</Label>
              <Textarea
                id="notes"
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                placeholder="Share your experience..."
                className="min-h-[100px]"
              />
            </div>

            <div className="grid gap-2">
              <Label>Images</Label>
              <div className="flex items-center gap-2">
                <Label
                  htmlFor="image-upload"
                  className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Photos</span>
                  <Input
                    id="image-upload"
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                </Label>
              </div>

              <AnimatePresence>
                {previewImages.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="grid grid-cols-3 gap-2 mt-2"
                  >
                    {previewImages.map((image, index) => (
                      <div key={index} className="relative aspect-square rounded-md overflow-hidden border">
                        <Image
                          src={image.url || "/placeholder.svg"}
                          alt={`Preview ${index}`}
                          fill
                          className="object-cover"
                        />
                        <button
                          type="button"
                          onClick={() => removeImage(index)}
                          className="absolute top-1 right-1 bg-background/80 rounded-full p-1 hover:bg-background"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="grid gap-2">
              <div className="flex items-center justify-between">
                <Label>Location</Label>
                <Button type="button" variant="ghost" size="sm" onClick={toggleMap} className="text-xs">
                  {isMapOpen ? "Hide Map" : "Show Map"}
                </Button>
              </div>

              <AnimatePresence>
                {isMapOpen && isMounted && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <LocationPicker initialCoordinates={formData.coordinates} onSelect={handleLocationSelect} />
                    <div className="text-xs text-muted-foreground mt-2">
                      <span>
                        Coordinates: {formData.coordinates.lat.toFixed(2)}, {formData.coordinates.lng.toFixed(2)}
                      </span>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit">Add Entry</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

