"use client"

import { useState } from "react"
import Link from "next/link"
import { Menu, X, Home, Briefcase, CheckSquare, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { cn } from "@/lib/utils"

export function MobileNav() {
  const [open, setOpen] = useState(false)
  const [activeItem, setActiveItem] = useState("home")

  const navItems = [
    { id: "home", label: "Home", href: "/", icon: Home },
    { id: "projects", label: "Projects", href: "/projects", icon: Briefcase },
    { id: "tasks", label: "Tasks", href: "/tasks", icon: CheckSquare },
    { id: "favorites", label: "Favorites", href: "/favorites", icon: Star },
  ]

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu className="h-6 w-6" />
          <span className="sr-only">Toggle menu</span>
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="flex flex-col">
        <div className="flex items-center justify-between border-b pb-4">
          <Link
            href="/"
            className="flex items-center gap-2 font-bold"
            onClick={() => {
              setActiveItem("home")
              setOpen(false)
            }}
          >
            <Home className="h-6 w-6" />
            PM Tool
          </Link>
          <Button variant="ghost" size="icon" onClick={() => setOpen(false)}>
            <X className="h-6 w-6" />
            <span className="sr-only">Close menu</span>
          </Button>
        </div>
        <nav className="flex flex-col gap-4 py-6">
          {navItems.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.id}
                href={item.href}
                className={cn(
                  "flex items-center gap-2 text-base font-medium transition-colors hover:text-primary",
                  activeItem === item.id ? "text-primary" : "text-muted-foreground",
                )}
                onClick={() => {
                  setActiveItem(item.id)
                  setOpen(false)
                }}
              >
                <Icon className="h-5 w-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>
      </SheetContent>
    </Sheet>
  )
}

