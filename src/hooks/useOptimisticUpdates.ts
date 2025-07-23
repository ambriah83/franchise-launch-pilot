import { useState, useCallback } from "react"
import { useToast } from "@/hooks/use-toast"

interface OptimisticUpdateOptions<T> {
  onSuccess?: (data: T) => void
  onError?: (error: Error) => void
  successMessage?: string
  errorMessage?: string
}

export function useOptimisticUpdates<T>() {
  const { toast } = useToast()
  const [optimisticData, setOptimisticData] = useState<T | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const executeOptimistic = useCallback(
    async <R>(
      optimisticValue: T,
      asyncOperation: () => Promise<R>,
      options: OptimisticUpdateOptions<R> = {}
    ): Promise<R | null> => {
      const {
        onSuccess,
        onError,
        successMessage = "Operation completed successfully",
        errorMessage = "Operation failed. Please try again."
      } = options

      setIsLoading(true)
      setOptimisticData(optimisticValue)

      try {
        const result = await asyncOperation()
        
        if (onSuccess) {
          onSuccess(result)
        }
        
        toast({
          title: "Success",
          description: successMessage
        })

        return result
      } catch (error) {
        // Revert optimistic update
        setOptimisticData(null)
        
        const errorObj = error instanceof Error ? error : new Error(String(error))
        
        if (onError) {
          onError(errorObj)
        }
        
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive"
        })

        return null
      } finally {
        setIsLoading(false)
      }
    },
    [toast]
  )

  const clearOptimistic = useCallback(() => {
    setOptimisticData(null)
  }, [])

  return {
    optimisticData,
    isLoading,
    executeOptimistic,
    clearOptimistic
  }
}