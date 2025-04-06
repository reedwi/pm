import { LogoutButton } from "@/components/logout-button"

export default function HomePage() {
  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4">
        <h1 className="text-3xl font-bold">Welcome to your Dashboard</h1>
        <p className="text-muted-foreground">
          Manage your projects and tasks efficiently
        </p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Quick Stats */}
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">Active Projects</h2>
          <p className="text-2xl font-bold">5</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">Pending Tasks</h2>
          <p className="text-2xl font-bold">12</p>
        </div>
        
        <div className="p-6 border rounded-lg bg-card">
          <h2 className="font-semibold mb-2">Completed Tasks</h2>
          <p className="text-2xl font-bold">24</p>
        </div>
      </div>
      
      <div className="flex justify-end">
        <LogoutButton />
      </div>
    </div>
  )
}
