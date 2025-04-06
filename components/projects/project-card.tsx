"use client"

import type React from "react"

import { Calendar, Clock, Edit, MoreHorizontal, Trash2 } from "lucide-react"
import { formatDistanceToNow } from "date-fns"
import type { Project, ProjectStatusCategory } from "@/types/index"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { AvatarGroup } from "@/components/ui/avatar-group"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

interface ProjectCardProps {
  project: Project
  onClick: () => void
}

const statusVariantMap: Record<ProjectStatusCategory, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  "in progress": "default",
  paused: "outline",
  completed: "secondary",
  cancelled: "destructive",
}

export function ProjectCard({ project, onClick }: ProjectCardProps) {
  const dueDate = project.endDate ? new Date(project.endDate) : null
  const isOverdue = dueDate && dueDate < new Date() && project.status.category !== "completed"

  const handleCardClick = (e: React.MouseEvent) => {
    // Prevent click if it's on the dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger="true"]')) {
      return
    }
    onClick()
  }

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden flex flex-col cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
      onClick={handleCardClick}
    >
      <div className="p-6 flex-1">
        <div className="flex justify-between items-start">
          <Badge variant={statusVariantMap[project.status.category]} className="mb-2">
            {project.status.status}
          </Badge>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" className="-mr-2 -mt-2" data-dropdown-trigger="true">
                <MoreHorizontal className="h-4 w-4" />
                <span className="sr-only">Open menu</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={(e) => e.stopPropagation()}>
                <Edit className="h-4 w-4 mr-2" />
                Edit project
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={(e) => e.stopPropagation()}>
                <Trash2 className="h-4 w-4 mr-2" />
                Archive project
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        <h3 className="text-lg font-semibold mt-1 mb-2">{project.name}</h3>
        <p className="text-sm text-muted-foreground line-clamp-2 mb-4">{project.description}</p>

        <div className="space-y-4">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span>Progress</span>
              <span>{project.progress}%</span>
            </div>
            <Progress value={project.progress} className="h-2" />
          </div>

          {dueDate && (
            <div className="flex items-center text-sm text-muted-foreground">
              <Calendar className="h-4 w-4 mr-1" />
              <span className={isOverdue ? "text-destructive font-medium" : ""}>
                {isOverdue ? "Overdue: " : "Due: "}
                {formatDistanceToNow(dueDate, { addSuffix: true })}
              </span>
            </div>
          )}
        </div>
      </div>

      <div className="p-6 pt-0 mt-4 flex items-center justify-between">
        <AvatarGroup limit={3}>
          {project.team.map((member) => (
            <Avatar key={member.id} className="border-2 border-background">
              <AvatarImage src={member.avatar || undefined} alt={member.name} />
              <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
            </Avatar>
          ))}
        </AvatarGroup>

        <div className="flex items-center text-sm text-muted-foreground">
          <Clock className="h-4 w-4 mr-1" />
          <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
        </div>
      </div>
    </div>
  )
}

