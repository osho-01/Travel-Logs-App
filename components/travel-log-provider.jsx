"use client"

import { createContext, useContext, useEffect, useState } from "react"
import { AddEntryModal } from "@/components/add-entry-modal"
import { EditEntryModal } from "@/components/edit-entry-modal"
import { DeleteEntryDialog } from "@/components/delete-entry-dialog"
import { useToast } from "@/hooks/use-toast"

const TravelLogContext = createContext({})

export function TravelLogProvider({ children }) {
  const [entries, setEntries] = useState([])
  const [isAddEntryModalOpen, setIsAddEntryModalOpen] = useState(false)
  const [editingEntry, setEditingEntry] = useState(null)
  const [deletingEntryId, setDeletingEntryId] = useState(null)
  const [activeView, setActiveView] = useState("list") // "list" or "map"
  const { toast } = useToast()

  // Load entries from localStorage on mount
  useEffect(() => {
    const savedEntries = localStorage.getItem("travelEntries")
    if (savedEntries) {
      try {
        setEntries(JSON.parse(savedEntries))
      } catch (error) {
        console.error("Failed to parse saved entries:", error)
      }
    }
  }, [])

  // Save entries to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("travelEntries", JSON.stringify(entries))
  }, [entries])

  const addEntry = (newEntry) => {
    const entryWithId = {
      ...newEntry,
      id: Date.now().toString(),
      createdAt: new Date().toISOString(),
    }
    setEntries((prev) => [...prev, entryWithId])
    toast({
      title: "Trip added",
      description: `Your trip to ${newEntry.destination} has been added.`,
    })
  }

  const updateEntry = (updatedEntry) => {
    setEntries((prev) =>
      prev.map((entry) =>
        entry.id === updatedEntry.id ? { ...updatedEntry, updatedAt: new Date().toISOString() } : entry,
      ),
    )
    toast({
      title: "Trip updated",
      description: `Your trip to ${updatedEntry.destination} has been updated.`,
    })
  }

  const deleteEntry = (id) => {
    const entryToDelete = entries.find((entry) => entry.id === id)
    setEntries((prev) => prev.filter((entry) => entry.id !== id))
    setDeletingEntryId(null)
    toast({
      title: "Trip deleted",
      description: `Your trip to ${entryToDelete?.destination || "the destination"} has been deleted.`,
      variant: "destructive",
    })
  }

  const openAddEntryModal = () => setIsAddEntryModalOpen(true)
  const closeAddEntryModal = () => setIsAddEntryModalOpen(false)

  const openEditEntryModal = (entry) => setEditingEntry(entry)
  const closeEditEntryModal = () => setEditingEntry(null)

  const openDeleteDialog = (id) => setDeletingEntryId(id)
  const closeDeleteDialog = () => setDeletingEntryId(null)

  const toggleView = () => {
    setActiveView((prev) => (prev === "list" ? "map" : "list"))
  }

  return (
    <TravelLogContext.Provider
      value={{
        entries,
        addEntry,
        updateEntry,
        deleteEntry,
        openAddEntryModal,
        closeAddEntryModal,
        openEditEntryModal,
        closeEditEntryModal,
        openDeleteDialog,
        closeDeleteDialog,
        activeView,
        toggleView,
      }}
    >
      {children}
      <AddEntryModal isOpen={isAddEntryModalOpen} onClose={closeAddEntryModal} onSubmit={addEntry} />
      {editingEntry && (
        <EditEntryModal
          isOpen={!!editingEntry}
          onClose={closeEditEntryModal}
          onSubmit={updateEntry}
          entry={editingEntry}
        />
      )}
      <DeleteEntryDialog
        isOpen={!!deletingEntryId}
        onClose={closeDeleteDialog}
        onConfirm={() => deleteEntry(deletingEntryId)}
      />
    </TravelLogContext.Provider>
  )
}

export const useTravelLog = () => useContext(TravelLogContext)

