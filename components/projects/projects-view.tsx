"use client"

import { useState, useEffect } from "react"
import { Plus, Filter, Search, SortAsc, SortDesc } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ProjectCard } from "./project-card"
import { ProjectList } from "./project-list"
import { ProjectFilters } from "./project-filters"
import type { Project, ProjectStatusCategory } from "@/types/index"
import { ProjectTable } from "./project-table"
import { ViewModeSelector } from "./view-mode-selector"
import { ProjectSidebar } from "./project-sidebar"
import type { DateRange } from "react-day-picker"
import { projectsApi } from "@/api/projects"
import type { ProjectInsert } from "@/api/projects"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ProjectForm } from "./project-form"
import { toast } from "sonner"
import { useOrganization } from "@/contexts/organization-context"

export function ProjectsView() {
  const { currentOrganization, loading: orgLoading } = useOrganization()
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const [showFilters, setShowFilters] = useState(false)
  const [viewMode, setViewMode] = useState<"grid" | "list" | "table">("grid")
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc")
  const [sortBy, setSortBy] = useState<"name" | "endDate" | "status">("name")
  const [statusFilter, setStatusFilter] = useState<ProjectStatusCategory | "all">("all")
  const [dateRange, setDateRange] = useState<DateRange | undefined>(undefined)
  const [dateField, setDateField] = useState<"startDate" | "endDate">("endDate")
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [createDialogOpen, setCreateDialogOpen] = useState(false)

  useEffect(() => {
    fetchProjects()
  }, [])

  const fetchProjects = async () => {
    try {
      setLoading(true)
      const data = await projectsApi.getAll()
      setProjects(data)
    } catch (error) {
      toast.error(`Failed to fetch projects: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setLoading(false)
    }
  }

  const handleCreateProject = async (projectData: ProjectInsert) => {
    try {
      console.log('Creating project with data:', projectData)
      const newProject = await projectsApi.create(projectData)
      console.log('Project created successfully:', newProject)
      setProjects((prev) => [newProject, ...prev])
      setCreateDialogOpen(false)
      toast.success("Project created successfully")
    } catch (error) {
      console.error('Failed to create project:', error)
      toast.error(`Failed to create project: ${error instanceof Error ? error.message : 'Unknown error'}`)
    }
  }

  const handleProjectClick = (project: Project) => {
    setSelectedProject(project)
    setSidebarOpen(true)
  }

  // Filter and sort projects
  const filteredProjects = projects
    .filter((project) => {
      // Search filter
      const matchesSearch =
        project.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (project.description?.toLowerCase() || "").includes(searchQuery.toLowerCase())

      // Status filter
      const matchesStatus = statusFilter === "all" || project.status?.category === statusFilter

      // Date range filter
      let matchesDateRange = true
      if (dateRange?.from) {
        const fromDate = new Date(dateRange.from)
        fromDate.setHours(0, 0, 0, 0)

        const fieldDate = project[dateField] ? new Date(project[dateField]!) : null

        if (fieldDate) {
          matchesDateRange = fieldDate >= fromDate

          if (dateRange.to && matchesDateRange) {
            const toDate = new Date(dateRange.to)
            toDate.setHours(23, 59, 59, 999)
            matchesDateRange = fieldDate <= toDate
          }
        } else {
          matchesDateRange = false
        }
      }

      return matchesSearch && matchesStatus && matchesDateRange
    })
    .sort((a, b) => {
      if (sortBy === "name") {
        return sortOrder === "asc" ? a.name.localeCompare(b.name) : b.name.localeCompare(a.name)
      } else if (sortBy === "endDate") {
        if (!a.endDate && !b.endDate) return 0
        if (!a.endDate) return sortOrder === "asc" ? 1 : -1
        if (!b.endDate) return sortOrder === "asc" ? -1 : 1
        return sortOrder === "asc"
          ? new Date(a.endDate).getTime() - new Date(b.endDate).getTime()
          : new Date(b.endDate).getTime() - new Date(a.endDate).getTime()
      } else if (sortBy === "status") {
        return sortOrder === "asc"
          ? (a.status?.status || "").localeCompare(b.status?.status || "")
          : (b.status?.status || "").localeCompare(a.status?.status || "")
      }
      return 0
    })

  if (orgLoading || loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!currentOrganization) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <h3 className="text-lg font-medium">No organization found</h3>
        <p className="text-muted-foreground mt-1">Please join or create an organization to continue</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <h1 className="text-3xl font-bold">Projects</h1>
        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
          <DialogTrigger asChild>
            <Button className="sm:w-auto w-full">
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
            </DialogHeader>
            <ProjectForm onSubmit={handleCreateProject} organizationId={currentOrganization.id} />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search projects..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="flex gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setShowFilters(!showFilters)}
            className={showFilters ? "bg-accent" : ""}
          >
            <Filter className="h-4 w-4" />
          </Button>
          <Select value={sortBy} onValueChange={(value) => setSortBy(value as "name" | "endDate" | "status")}>
            <SelectTrigger className="w-[130px]">
              <SelectValue placeholder="Sort by" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="name">Name</SelectItem>
              <SelectItem value="endDate">Due Date</SelectItem>
              <SelectItem value="status">Status</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="outline" size="icon" onClick={() => setSortOrder(sortOrder === "asc" ? "desc" : "asc")}>
            {sortOrder === "asc" ? <SortAsc className="h-4 w-4" /> : <SortDesc className="h-4 w-4" />}
          </Button>
          <ViewModeSelector currentView={viewMode} onChange={setViewMode} />
        </div>
      </div>

      {showFilters && (
        <ProjectFilters
          statusFilter={statusFilter}
          onStatusChange={(status) => setStatusFilter(status)}
          dateRange={dateRange}
          onDateRangeChange={setDateRange}
          dateField={dateField}
          onDateFieldChange={setDateField}
        />
      )}

      {filteredProjects.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <div className="rounded-full bg-muted p-3 mb-4">
            <Search className="h-6 w-6 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-medium">No projects found</h3>
          <p className="text-muted-foreground mt-1">Try adjusting your search or filter criteria</p>
        </div>
      ) : viewMode === "grid" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredProjects.map((project) => (
            <ProjectCard key={project.id} project={project} onClick={() => handleProjectClick(project)} />
          ))}
        </div>
      ) : viewMode === "list" ? (
        <div className="space-y-4">
          {filteredProjects.map((project) => (
            <ProjectList key={project.id} project={project} onClick={() => handleProjectClick(project)} />
          ))}
        </div>
      ) : (
        <ProjectTable
          projects={filteredProjects}
          sortBy={sortBy}
          sortOrder={sortOrder}
          onSort={(column) => {
            if (sortBy === column) {
              setSortOrder(sortOrder === "asc" ? "desc" : "asc")
            } else {
              setSortBy(column)
              setSortOrder("asc")
            }
          }}
          onProjectClick={handleProjectClick}
        />
      )}

      <ProjectSidebar project={selectedProject} open={sidebarOpen} onOpenChange={setSidebarOpen} />
    </div>
  )
}

