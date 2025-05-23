import { Skeleton } from "@/components/ui/skeleton"

export function TaskManagementSkeleton() {
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <Skeleton className="h-8 w-48" />
        <Skeleton className="h-10 w-32" />
      </div>

      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-2">
          <div className="flex items-center gap-2">
            <Skeleton className="h-6 w-64" />
          </div>
          <div className="ml-6 space-y-2">
            {Array.from({ length: 2 }).map((_, j) => (
              <div key={j} className="space-y-2">
                <div className="flex items-center gap-2">
                  <Skeleton className="h-6 w-56" />
                </div>
                <div className="ml-6 space-y-2">
                  {Array.from({ length: 2 }).map((_, k) => (
                    <Skeleton key={k} className="h-12 w-full" />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  )
}
