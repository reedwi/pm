export interface TaskGroup {
  id: number
  name: string
  created_at: string
  updated_at: string | null
  parent_id: number | null
  project_id: number
}

export interface Task {
  id: number
  name: string
  description: string | null
  created_at: string
  updated_at: string | null
  project_id: number | null
  organization_id: number | null
  task_group_id: number | null
  start_date: string | null
  end_date: string | null
  estimate: string | null
  assignee_ids: number[]
}

export interface User {
  id: number
  name: string
  email: string
  avatarUrl: string
}
