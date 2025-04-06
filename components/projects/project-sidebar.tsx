"use client"

import { useRouter } from "next/navigation"
import { formatDistanceToNow, format } from "date-fns"
import { Calendar, Clock, Edit, ExternalLink } from "lucide-react"
import type { Project, ProjectStatusCategory } from "@/types/index"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from "@/components/ui/sheet"
import { Separator } from "@/components/ui/separator"

interface ProjectSidebarProps {
  project: Project | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const statusVariantMap: Record<ProjectStatusCategory, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  "in progress": "default",
  paused: "outline",
  completed: "secondary",
  cancelled: "destructive",
}

export function ProjectSidebar({ project, open, onOpenChange }: ProjectSidebarProps) {
  const router = useRouter()

  if (!project) return null

  const dueDate = project.endDate ? new Date(project.endDate) : null
  const startDate = project.startDate ? new Date(project.startDate) : null
  const isOverdue = dueDate && dueDate < new Date() && project.status.category !== "completed"

  const navigateToProject = () => {
    router.push(`/projects/${project.id}`)
    onOpenChange(false)
  }

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-md overflow-auto p-6">
        <SheetHeader className="space-y-1">
          <div className="flex items-center">
            <Badge variant={statusVariantMap[project.status.category]}>{project.status.status}</Badge>
          </div>
          <SheetTitle className="text-xl">{project.name}</SheetTitle>
          <SheetDescription className="text-sm text-muted-foreground">
            {project.description || "No description provided."}
          </SheetDescription>
        </SheetHeader>

        <div className="mt-6 space-y-6">
          {/* Progress */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Progress</h3>
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Completion</span>
                <span>{project.progress}%</span>
              </div>
              <Progress value={project.progress} className="h-2" />
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Timeline</h3>
            <div className="space-y-1">
              {startDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-muted-foreground mr-1">Start:</span>
                  <span>{format(startDate, "MMM d, yyyy")}</span>
                </div>
              )}
              {dueDate && (
                <div className="flex items-center text-sm">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span className="text-muted-foreground mr-1">Due:</span>
                  <span className={isOverdue ? "text-destructive font-medium" : ""}>
                    {format(dueDate, "MMM d, yyyy")}
                    {isOverdue && " (Overdue)"}
                  </span>
                </div>
              )}
              <div className="flex items-center text-sm">
                <Clock className="h-4 w-4 mr-2" />
                <span className="text-muted-foreground mr-1">Updated:</span>
                <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
              </div>
            </div>
          </div>

          {/* Team */}
          <div className="space-y-2">
            <h3 className="text-sm font-medium">Team</h3>
            <div className="space-y-3">
              {project.team.map((member) => (
                <div key={member.id} className="flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={member.avatar || undefined} alt={member.name} />
                    <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="text-sm font-medium">{member.name}</p>
                    <p className="text-xs text-muted-foreground">{member.role || "Team Member"}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Actions */}
          <div className="flex flex-col gap-2">
            <Button onClick={navigateToProject}>
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Project
            </Button>
            <Button variant="outline">
              <Edit className="h-4 w-4 mr-2" />
              Edit Project
            </Button>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

