import type { Database } from './database'

// Database types
type ProjectTable = Database['public']['Tables']['projects']
type ProjectRow = ProjectTable['Row']
type ProjectStatusTable = Database['public']['Tables']['project_statuses']
type ProjectStatusRow = ProjectStatusTable['Row']
type ProjectUserTable = Database['public']['Tables']['project_users']
type ProjectUserRow = ProjectUserTable['Row']

// Frontend types
export type ProjectStatusCategory = 'new' | 'in progress' | 'paused' | 'completed' | 'cancelled'

export interface ProjectStatus {
  id: number
  status: string
  category: ProjectStatusCategory
}

export interface TeamMember {
  id: string
  name: string
  avatar: string | null
  role: string | null
}

export interface Project {
  id: number
  name: string
  description: string | null
  status: ProjectStatus
  progress: number
  startDate: string | null
  endDate: string | null
  createdAt: string
  updatedAt: string
  clientId: number | null
  team: TeamMember[]
}

// Type guards
export function isValidStatusCategory(category: string): category is ProjectStatusCategory {
  return ['new', 'in progress', 'paused', 'completed', 'cancelled'].includes(category as ProjectStatusCategory)
}

// Helper to parse status category
function parseStatusCategory(category: string): ProjectStatusCategory {
  return isValidStatusCategory(category) ? category : 'new'
}

// Transformation functions
export function transformProjectStatus(statusRow: ProjectStatusRow): ProjectStatus {
  return {
    id: statusRow.id,
    status: statusRow.status,
    category: parseStatusCategory(statusRow.category)
  }
}

export function transformProjectWithRelations(
  project: ProjectRow,
  status: ProjectStatusRow,
  teamMembers: TeamMember[] = []
): Project {
  return {
    id: project.id,
    name: project.name,
    description: project.description,
    status: transformProjectStatus(status),
    progress: 0, // This needs to be calculated based on tasks or stored separately
    startDate: project.start_date,
    endDate: project.end_date,
    createdAt: project.created_at,
    updatedAt: project.updated_at,
    clientId: project.client_id,
    team: teamMembers
  }
} 