"use client"

import { ModeToggle } from "@/components/mode-toggle"
import { Button } from "@/components/ui/button"
import { PlusCircle, Globe } from "lucide-react"
import { useTravelLog } from "@/components/travel-log-provider"
import { motion } from "framer-motion"

export function Navbar() {
  const { openAddEntryModal } = useTravelLog()

  return (
    <motion.header
      className="border-b"
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Globe className="h-6 w-6 text-primary" />
          <h1 className="text-xl font-bold">Travel Log</h1>
        </div>
        <div className="flex items-center gap-2">
          <Button onClick={openAddEntryModal} className="gap-1" size="sm">
            <PlusCircle className="h-4 w-4" />
            <span className="hidden sm:inline">Add Trip</span>
          </Button>
          <ModeToggle />
        </div>
      </div>
    </motion.header>
  )
}

