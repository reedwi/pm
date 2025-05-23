import type { Task } from "@/types/index"

export const mockTasks: Task[] = [
  {
    id: 1,
    name: "Design Homepage",
    description: "Create wireframes and mockups for the homepage",
    status: "in progress",
    priority: "high",
    dueDate: "2024-04-15",
    projectId: 1,
    assignees: [
      {
        id: "usr_1",
        name: "John Doe",
        avatar: null,
        role: "Lead Designer"
      }
    ],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: "2024-03-20T15:30:00Z"
  },
  {
    id: 2,
    name: "Implement Authentication",
    description: "Set up user authentication system",
    status: "todo",
    priority: "high",
    dueDate: "2024-04-20",
    projectId: 1,
    assignees: [
      {
        id: "usr_2",
        name: "Jane Smith",
        avatar: null,
        role: "Developer"
      }
    ],
    createdAt: "2024-03-15T10:00:00Z",
    updatedAt: null
  },
  {
    id: 3,
    name: "Database Schema Design",
    description: "Design and implement database schema",
    status: "completed",
    priority: "medium",
    dueDate: "2024-03-10",
    projectId: 3,
    assignees: [
      {
        id: "usr_4",
        name: "Sarah Wilson",
        avatar: null,
        role: "Database Engineer"
      }
    ],
    createdAt: "2024-02-01T08:00:00Z",
    updatedAt: "2024-03-10T16:45:00Z"
  }
] 