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

interface ProjectListProps {
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

export function ProjectList({ project, onClick }: ProjectListProps) {
  const dueDate = project.endDate ? new Date(project.endDate) : null
  const isOverdue = dueDate && dueDate < new Date() && project.status.category !== "completed"

  const handleRowClick = (e: React.MouseEvent) => {
    // Prevent click if it's on the dropdown menu
    if ((e.target as HTMLElement).closest('[data-dropdown-trigger="true"]')) {
      return
    }
    onClick()
  }

  return (
    <div
      className="rounded-lg border bg-card text-card-foreground shadow-sm overflow-hidden cursor-pointer hover:border-primary/50 hover:shadow-md transition-all"
      onClick={handleRowClick}
    >
      <div className="p-6">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-2 mb-1">
              <Badge variant={statusVariantMap[project.status.category]}>{project.status.status}</Badge>
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

            <h3 className="text-lg font-semibold truncate">{project.name}</h3>
            <p className="text-sm text-muted-foreground line-clamp-1 mt-1">{project.description}</p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <div className="w-full sm:w-40">
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>

            <AvatarGroup limit={3}>
              {project.team.map((member) => (
                <Avatar key={member.id} className="border-2 border-background">
                  <AvatarImage src={member.avatar || undefined} alt={member.name} />
                  <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                </Avatar>
              ))}
            </AvatarGroup>

            <div className="flex items-center gap-2">
              <div className="text-sm text-muted-foreground hidden md:flex items-center">
                <Clock className="h-4 w-4 mr-1" />
                <span>Updated {formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" data-dropdown-trigger="true">
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
          </div>
        </div>
      </div>
    </div>
  )
}

