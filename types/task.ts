import type { Database } from './database'

// Database types
type TaskTable = Database['public']['Tables']['tasks']
type TaskRow = TaskTable['Row']
type TaskUserTable = Database['public']['Tables']['task_users']
type TaskUserRow = TaskUserTable['Row']

// Frontend types
export type TaskStatus = 'todo' | 'in progress' | 'review' | 'completed' | 'cancelled'

export interface TaskAssignee {
  id: string
  name: string
  avatar: string | null
  role: string | null
}

export interface Task {
  id: number
  name: string
  description: string | null
  status: TaskStatus
  priority: 'low' | 'medium' | 'high'
  dueDate: string | null
  projectId: number | null
  assignees: TaskAssignee[]
  createdAt: string
  updatedAt: string | null
}

// Type guards
export function isValidTaskStatus(status: string): status is TaskStatus {
  return ['todo', 'in progress', 'review', 'completed', 'cancelled'].includes(status as TaskStatus)
}

// Transformation functions
export function transformTaskAssignee(userRow: TaskUserRow): TaskAssignee {
  return {
    id: userRow.user_id,
    name: userRow.type || 'Team Member',
    avatar: null,
    role: userRow.type
  }
}

export function transformTask(
  task: TaskRow,
  assignees: TaskAssignee[] = []
): Task {
  return {
    id: task.id,
    name: task.name,
    description: task.description,
    status: 'todo', // This should be determined from task_status or similar
    priority: 'medium', // This should be determined from task_priority or similar
    dueDate: null, // This should be added to the database schema
    projectId: task.project_id,
    assignees,
    createdAt: task.created_at,
    updatedAt: task.updated_at
  }
} 