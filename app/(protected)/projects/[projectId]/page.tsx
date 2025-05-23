import Link from "next/link"
import { ChevronLeft } from "lucide-react"
import { Button } from "@/components/ui/button"
import { projectsApi } from "@/api/projects"
import { notFound } from "next/navigation"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { formatDistanceToNow } from "date-fns"
import { Suspense } from "react"
import { TaskManagement } from "./tasks/task-management"
import { TaskManagementSkeleton } from "./tasks/task-management-skeleton"

interface TeamMember {
  user_id: string
  role: string
  user: {
    id: string
    email: string
    raw_user_meta_data: {
      name?: string
      avatar_url?: string
    }
  }
}

export default async function ProjectPage({
  params,
}: {
  params: { projectId: string }
}) {
  const resolvedParams = await params
  const projectId = parseInt(resolvedParams.projectId)
  if (isNaN(projectId)) {
    notFound()
  }

  const project = await projectsApi.getById(projectId)
  if (!project) {
    notFound()
  }

  return (
    <div className="container mx-auto py-8">
      <div className="mb-8">
        <Link href="/projects">
          <Button variant="ghost" className="mb-4">
            <ChevronLeft className="mr-2 h-4 w-4" />
            Back to Projects
          </Button>
        </Link>
        <h1 className="text-3xl font-bold mb-2">{project.name}</h1>
        <p className="text-muted-foreground">{project.description}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-2">
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Project Details</h2>
            <div className="space-y-4">
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Status</h3>
                <Badge variant={project.status?.category === 'active' ? 'default' : 'secondary'}>
                  {project.status?.status || 'Not Set'}
                </Badge>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Created</h3>
                <p>{formatDistanceToNow(new Date(project.created_at), { addSuffix: true })}</p>
              </div>
              <div>
                <h3 className="text-sm font-medium text-muted-foreground mb-1">Last Updated</h3>
                <p>{formatDistanceToNow(new Date(project.updated_at), { addSuffix: true })}</p>
              </div>
            </div>
          </div>
        </div>

        <div>
          <div className="bg-card rounded-lg border p-6">
            <h2 className="text-xl font-semibold mb-4">Team Members</h2>
            <div className="space-y-4">
              {project.team?.map((member: TeamMember) => (
                <div key={member.user_id} className="flex items-center gap-3">
                  <Avatar>
                    <AvatarFallback>
                      {member.user.raw_user_meta_data?.name?.charAt(0) || member.user.email.charAt(0).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{member.user.raw_user_meta_data?.name || member.user.email}</p>
                    <p className="text-sm text-muted-foreground capitalize">{member.role}</p>
                  </div>
                </div>
              ))}
              {(!project.team || project.team.length === 0) && (
                <p className="text-muted-foreground">No team members assigned</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="bg-card rounded-lg border p-6">
          <div className="flex items-center justify-between mb-4">
          </div>
          <Suspense fallback={<TaskManagementSkeleton />}>
            <TaskManagement projectId={projectId} />
          </Suspense>
        </div>
      </div>
    </div>
  )
}
