import { Navbar } from "@/components/navbar"
import { TravelLogProvider } from "@/components/travel-log-provider"
import { TravelDashboard } from "@/components/travel-dashboard"
import "./globals.css"

export default function Home() {
  return (
    <TravelLogProvider>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1 container mx-auto px-4 py-6">
          <TravelDashboard />
        </main>
        <footer className="border-t py-4">
          <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
            © {new Date().getFullYear()} Travel Log App. All rights reserved.
          </div>
        </footer>
      </div>
    </TravelLogProvider>
  )
}

