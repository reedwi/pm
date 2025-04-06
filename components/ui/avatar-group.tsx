import * as React from "react"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { cn } from "@/lib/utils"

interface AvatarGroupProps extends React.HTMLAttributes<HTMLDivElement> {
  limit?: number
}

export function AvatarGroup({ limit = 3, className, ...props }: AvatarGroupProps) {
  const children = React.Children.toArray(props.children)
  const visibleChildren = limit ? children.slice(0, limit) : children
  const remainingCount = children.length - visibleChildren.length

  return (
    <div className={cn("flex -space-x-2", className)} {...props}>
      {visibleChildren}
      {remainingCount > 0 && (
        <Avatar className="border-2 border-background">
          <AvatarFallback className="bg-muted text-muted-foreground">+{remainingCount}</AvatarFallback>
        </Avatar>
      )}
    </div>
  )
}

