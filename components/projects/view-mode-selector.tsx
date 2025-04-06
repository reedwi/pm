"use client"

import { Grid, List, Table2 } from "lucide-react"
import { Button } from "@/components/ui/button"

type ViewMode = "grid" | "list" | "table"

interface ViewModeSelectorProps {
  currentView: ViewMode
  onChange: (mode: ViewMode) => void
}

export function ViewModeSelector({ currentView, onChange }: ViewModeSelectorProps) {
  return (
    <div className="flex border rounded-md">
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-r-none ${currentView === "grid" ? "bg-accent" : ""}`}
        onClick={() => onChange("grid")}
        aria-label="Grid view"
      >
        <Grid className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-l-none rounded-r-none ${currentView === "list" ? "bg-accent" : ""}`}
        onClick={() => onChange("list")}
        aria-label="List view"
      >
        <List className="h-4 w-4" />
      </Button>
      <Button
        variant="ghost"
        size="icon"
        className={`rounded-l-none ${currentView === "table" ? "bg-accent" : ""}`}
        onClick={() => onChange("table")}
        aria-label="Table view"
      >
        <Table2 className="h-4 w-4" />
      </Button>
    </div>
  )
}

