import { Skeleton } from "@/components/ui/skeleton"
import { Card } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface LoadingStateProps {
  type?: "table" | "cards" | "form" | "page"
  rows?: number
  className?: string
}

export function LoadingState({ type = "cards", rows = 3, className }: LoadingStateProps) {
  switch (type) {
    case "table":
      return (
        <div className={cn("space-y-3", className)}>
          <Skeleton className="h-8 w-full" />
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="flex space-x-4">
              <Skeleton className="h-12 w-12" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
              </div>
            </div>
          ))}
        </div>
      )

    case "cards":
      return (
        <div className={cn("grid gap-4 md:grid-cols-2 lg:grid-cols-3", className)}>
          {Array.from({ length: rows }).map((_, i) => (
            <Card key={i} className="p-6">
              <div className="space-y-3">
                <Skeleton className="h-5 w-[180px]" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-full" />
                  <Skeleton className="h-4 w-[80%]" />
                </div>
                <div className="flex justify-between items-center">
                  <Skeleton className="h-6 w-[100px]" />
                  <Skeleton className="h-8 w-[80px]" />
                </div>
              </div>
            </Card>
          ))}
        </div>
      )

    case "form":
      return (
        <div className={cn("space-y-4", className)}>
          {Array.from({ length: rows }).map((_, i) => (
            <div key={i} className="space-y-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-10 w-full" />
            </div>
          ))}
          <div className="flex gap-3 pt-4">
            <Skeleton className="h-10 flex-1" />
            <Skeleton className="h-10 flex-1" />
          </div>
        </div>
      )

    case "page":
      return (
        <div className={cn("space-y-6", className)}>
          <div className="space-y-2">
            <Skeleton className="h-8 w-[300px]" />
            <Skeleton className="h-4 w-[500px]" />
          </div>
          <div className="flex gap-4">
            <Skeleton className="h-10 w-[120px]" />
            <Skeleton className="h-10 w-[200px]" />
          </div>
          <LoadingState type="cards" rows={6} />
        </div>
      )

    default:
      return (
        <div className={cn("space-y-3", className)}>
          {Array.from({ length: rows }).map((_, i) => (
            <Skeleton key={i} className="h-12 w-full" />
          ))}
        </div>
      )
  }
}