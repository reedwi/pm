import type { Project } from "@/types/index"

export const mockProjects: Project[] = [
  {
    id: 1,
    name: "Website Redesign",
    description: "Complete overhaul of the company website with modern design",
    status: {
      id: 1,
      status: "In Progress",
      category: "in progress"
    },
    progress: 60,
    startDate: "2024-01-15",
    endDate: "2024-05-15",
    clientId: 1,
    team: [
      {
        id: "usr_1",
        name: "John Doe",
        role: "Lead Designer",
        avatar: null
      },
      {
        id: "usr_2",
        name: "Jane Smith",
        role: "Developer",
        avatar: null
      }
    ],
    createdAt: "2024-01-15T10:00:00Z",
    updatedAt: "2024-03-20T15:30:00Z"
  },
  {
    id: 2,
    name: "Mobile App Development",
    description: "Native mobile application for iOS and Android",
    status: {
      id: 2,
      status: "New",
      category: "new"
    },
    progress: 0,
    startDate: "2024-03-01",
    endDate: "2024-07-01",
    clientId: 2,
    team: [
      {
        id: "usr_3",
        name: "Mike Johnson",
        role: "Mobile Developer",
        avatar: null
      }
    ],
    createdAt: "2024-03-01T09:00:00Z",
    updatedAt: "2024-03-01T09:00:00Z"
  },
  {
    id: 3,
    name: "Database Migration",
    description: "Migrate legacy database to new cloud infrastructure",
    status: {
      id: 3,
      status: "Completed",
      category: "completed"
    },
    progress: 100,
    startDate: "2024-01-01",
    endDate: "2024-02-28",
    clientId: null,
    team: [
      {
        id: "usr_4",
        name: "Sarah Wilson",
        role: "Database Engineer",
        avatar: null
      },
      {
        id: "usr_5",
        name: "Tom Brown",
        role: "System Architect",
        avatar: null
      }
    ],
    createdAt: "2024-01-01T08:00:00Z",
    updatedAt: "2024-02-28T16:45:00Z"
  }
] 