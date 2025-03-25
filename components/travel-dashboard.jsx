"use client"

import { useState } from "react"
import { useTravelLog } from "@/components/travel-log-provider"
import { TravelMap } from "@/components/travel-map"
import { TravelList } from "@/components/travel-list"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { Map, List } from "lucide-react"

export function TravelDashboard() {
  const [activeTab, setActiveTab] = useState("list")
  const { entries } = useTravelLog()

  return (
    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.5 }} className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Your Travel Log</h2>
          <p className="text-muted-foreground">
            {entries.length === 0
              ? "Start by adding your first travel destination!"
              : `You have ${entries.length} travel ${entries.length === 1 ? "entry" : "entries"}.`}
          </p>
        </div>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full sm:w-auto">
          <TabsList className="grid w-full grid-cols-2 sm:w-[200px]">
            <TabsTrigger value="list" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              List
            </TabsTrigger>
            <TabsTrigger value="map" className="flex items-center gap-2">
              <Map className="h-4 w-4" />
              Map
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="relative">{activeTab === "list" ? <TravelList /> : <TravelMap />}</div>
    </motion.div>
  )
}

