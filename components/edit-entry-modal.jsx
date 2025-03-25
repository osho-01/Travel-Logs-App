"use client"

import { useState, useEffect } from "react"
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

export function EditEntryModal({ isOpen, onClose, onSubmit, entry }) {
  const [formData, setFormData] = useState({
    id: "",
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

  useEffect(() => {
    if (entry) {
      setFormData({
        ...entry,
        startDate: new Date(entry.startDate),
        endDate: new Date(entry.endDate),
      })
      setDateRange({
        from: new Date(entry.startDate),
        to: new Date(entry.endDate),
      })

      // Set preview images
      const previews = entry.images.map((url, index) => ({
        url,
        name: `Image ${index + 1}`,
      }))
      setPreviewImages(previews)
    }
  }, [entry])

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
  }

  const handleImageUpload = (e) => {
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
  }

  const removeImage = (index) => {
    setPreviewImages((prev) => prev.filter((_, i) => i !== index))
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }))
  }

  const handleDateRangeChange = (range) => {
    setDateRange(range)
    if (range?.from) {
      setFormData((prev) => ({ ...prev, startDate: range.from }))
    }
    if (range?.to) {
      setFormData((prev) => ({ ...prev, endDate: range.to }))
    }
  }

  const handleMapClick = (e) => {
    // Get coordinates from map click
    const mapContainer = e.currentTarget
    const rect = mapContainer.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Convert x,y to lat,lng (simplified)
    const lng = (x / mapContainer.clientWidth) * 360 - 180
    const lat = 90 - (y / mapContainer.clientHeight) * 180

    setFormData((prev) => ({
      ...prev,
      coordinates: { lat, lng },
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit(formData)
    onClose()
  }

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Travel Entry</DialogTitle>
          <DialogDescription>Update the details of your travel experience.</DialogDescription>
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
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar mode="range" selected={dateRange} onSelect={handleDateRangeChange} initialFocus />
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
                  htmlFor="image-upload-edit"
                  className="cursor-pointer flex items-center gap-2 border rounded-md px-3 py-2 hover:bg-muted transition-colors"
                >
                  <Upload className="h-4 w-4" />
                  <span>Upload Photos</span>
                  <Input
                    id="image-upload-edit"
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
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsMapOpen(!isMapOpen)}
                  className="text-xs"
                >
                  {/* {isMapOpen ? "Hide Map" : "Show Maps"} */}
                </Button>
              </div>

              <AnimatePresence>
                {isMapOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden"
                  >
                    <div
                      className="border rounded-md h-[200px] relative bg-muted cursor-crosshair"
                      onClick={handleMapClick}
                    >
                      {/* Simplified world map */}
                      <div className="absolute inset-0 flex items-center justify-center text-muted-foreground">
                        <span className="text-sm">Click on the map to set location</span>
                      </div>

                      {/* Marker for selected location */}
                      {formData.coordinates.lat !== 0 && formData.coordinates.lng !== 0 && (
                        <div
                          className="absolute w-4 h-4 transform -translate-x-2 -translate-y-2"
                          style={{
                            left: `${((formData.coordinates.lng + 180) / 360) * 100}%`,
                            top: `${((90 - formData.coordinates.lat) / 180) * 100}%`,
                          }}
                        >
                          <MapPin className="h-4 w-4 text-primary" />
                        </div>
                      )}
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 flex justify-between">
                      <span>
                        Coordinates: {formData.coordinates.lat.toFixed(2)}, {formData.coordinates.lng.toFixed(2)}
                      </span>
                      <button
                        type="button"
                        onClick={() => setFormData((prev) => ({ ...prev, coordinates: { lat: 0, lng: 0 } }))}
                        className="text-xs underline"
                      >
                        Reset
                      </button>
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
            <Button type="submit">Save Changes</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

