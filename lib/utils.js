import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
  return twMerge(clsx(inputs))
}

export function formatDate(date) {
  if (!date) return ""

  const d = new Date(date)
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export function generateRandomCoordinates() {
  // Generate random coordinates within reasonable bounds
  const lat = Math.random() * 140 - 70 // -70 to 70
  const lng = Math.random() * 360 - 180 // -180 to 180
  return { lat, lng }
}

