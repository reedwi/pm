import Link from "next/link"
import { ChevronLeft } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { mockProjects } from "@/data/mock-projects"

export default function ProjectPage({ params }: { params: { id: string } }) {
  // In a real app, you would fetch the project data from your API
  const project = mockProjects.find(p => p.id === params.id)
  
  if (!project) {
    return (
      <div className="container py-8">
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <h1 className="text-2xl font-bold mb-4">Project Not Found</h1>
          <p className="text-muted-foreground mb-6">The project you're looking for doesn't exist or has been removed.</p>
          <Link href="/projects">
            <Button>
              <ChevronLeft className="h-4 w-4 mr-2" />
              Back to Projects
            </Button>
          </Link>
        </div>
      </div>
    )
  }
  
  return (
    <div className="container py-8">
      <div className="mb-6">
        <Link href="/projects">
          <Button variant="ghost" className="pl-0 hover:bg-transparent">
            <ChevronLeft className="h-4 w-4 mr-2" />
            Back to Projects
          </Button>
        </Link>
      </div>
      
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">{project.name}</h1>
          <p className="text-muted-foreground mt-2">{project.description}</p>
        </div>
        
        <div className="p-6 bg-muted/20 rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Project Details</h2>
          <p className="text-muted-foreground">This is a placeholder for the full project page. In a real application, this would display detailed information about the project, tasks, timeline, team members, and more.</p>
        </div>
      </div>
    </div>
  )
}
