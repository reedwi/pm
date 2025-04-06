"use client"

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
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

interface ProjectTableProps {
  projects: Project[]
  sortBy: "name" | "endDate" | "status"
  sortOrder: "asc" | "desc"
  onSort: (column: "name" | "endDate" | "status") => void
  onProjectClick: (project: Project) => void
}

const statusVariantMap: Record<ProjectStatusCategory, "default" | "secondary" | "destructive" | "outline"> = {
  new: "secondary",
  "in progress": "default",
  paused: "outline",
  completed: "secondary",
  cancelled: "destructive",
}

export function ProjectTable({ projects, sortBy, sortOrder, onSort, onProjectClick }: ProjectTableProps) {
  return (
    <div className="rounded-md border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[300px] cursor-pointer" onClick={() => onSort("name")}>
              <div className="flex items-center">
                Project
                {sortBy === "name" && <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </div>
            </TableHead>
            <TableHead className="w-[100px] cursor-pointer" onClick={() => onSort("status")}>
              <div className="flex items-center">
                Status
                {sortBy === "status" && <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </div>
            </TableHead>
            <TableHead className="w-[150px]">Progress</TableHead>
            <TableHead className="w-[150px] cursor-pointer" onClick={() => onSort("endDate")}>
              <div className="flex items-center">
                Due Date
                {sortBy === "endDate" && <span className="ml-2">{sortOrder === "asc" ? "↑" : "↓"}</span>}
              </div>
            </TableHead>
            <TableHead className="w-[150px]">Team</TableHead>
            <TableHead className="w-[150px]">Last Updated</TableHead>
            <TableHead className="w-[50px]"></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.length === 0 ? (
            <TableRow>
              <TableCell colSpan={7} className="h-24 text-center">
                No projects found.
              </TableCell>
            </TableRow>
          ) : (
            projects.map((project) => {
              const dueDate = project.endDate ? new Date(project.endDate) : null
              const isOverdue = dueDate && dueDate < new Date() && project.status.category !== "completed"

              return (
                <TableRow
                  key={project.id}
                  className="cursor-pointer hover:bg-muted"
                  onClick={(e) => {
                    // Prevent click if it's on the dropdown menu
                    if ((e.target as HTMLElement).closest('[data-dropdown-trigger="true"]')) {
                      return
                    }
                    onProjectClick(project)
                  }}
                >
                  <TableCell>
                    <div className="flex flex-col">
                      <span className="font-medium">{project.name}</span>
                      <span className="text-sm text-muted-foreground line-clamp-1">{project.description}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={statusVariantMap[project.status.category]}>{project.status.status}</Badge>
                  </TableCell>
                  <TableCell>
                    <div className="w-full">
                      <div className="flex justify-between text-xs mb-1">
                        <span>{project.progress}%</span>
                      </div>
                      <Progress value={project.progress} className="h-2" />
                    </div>
                  </TableCell>
                  <TableCell>
                    {dueDate && (
                      <div className="flex items-center text-sm">
                        <Calendar className="h-4 w-4 mr-1" />
                        <span className={isOverdue ? "text-destructive font-medium" : ""}>
                          {formatDistanceToNow(dueDate, { addSuffix: true })}
                        </span>
                      </div>
                    )}
                  </TableCell>
                  <TableCell>
                    <AvatarGroup limit={3}>
                      {project.team.map((member) => (
                        <Avatar key={member.id} className="border-2 border-background">
                          <AvatarImage src={member.avatar || undefined} alt={member.name} />
                          <AvatarFallback>{member.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                      ))}
                    </AvatarGroup>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Clock className="h-4 w-4 mr-1" />
                      <span>{formatDistanceToNow(new Date(project.updatedAt), { addSuffix: true })}</span>
                    </div>
                  </TableCell>
                  <TableCell>
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
                  </TableCell>
                </TableRow>
              )
            })
          )}
        </TableBody>
      </Table>
    </div>
  )
}

