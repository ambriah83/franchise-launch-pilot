import { useEffect, useCallback } from "react"
import { UseFormReturn } from "react-hook-form"

interface FormPersistenceOptions {
  storageKey: string
  exclude?: string[]
  debounceMs?: number
}

export function useFormPersistence<T extends Record<string, any>>(
  form: UseFormReturn<T>,
  options: FormPersistenceOptions
) {
  const { storageKey, exclude = [], debounceMs = 500 } = options

  // Load persisted data on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(storageKey)
      if (saved) {
        const parsedData = JSON.parse(saved)
        const filteredData = Object.fromEntries(
          Object.entries(parsedData).filter(([key]) => !exclude.includes(key))
        ) as T
        form.reset(filteredData)
      }
    } catch (error) {
      console.warn("Failed to load persisted form data:", error)
    }
  }, [storageKey, exclude, form])

  // Save form data with debouncing
  const saveFormData = useCallback(
    (() => {
      let timeoutId: NodeJS.Timeout

      return (data: T) => {
        clearTimeout(timeoutId)
        timeoutId = setTimeout(() => {
          try {
            const dataToSave = Object.fromEntries(
              Object.entries(data).filter(([key]) => !exclude.includes(key))
            )
            localStorage.setItem(storageKey, JSON.stringify(dataToSave))
          } catch (error) {
            console.warn("Failed to persist form data:", error)
          }
        }, debounceMs)
      }
    })(),
    [storageKey, exclude, debounceMs]
  )

  // Watch form changes and save
  useEffect(() => {
    const subscription = form.watch((data) => {
      if (data && Object.keys(data).length > 0) {
        saveFormData(data as T)
      }
    })

    return () => subscription.unsubscribe()
  }, [form, saveFormData])

  // Clear persisted data
  const clearPersistedData = useCallback(() => {
    try {
      localStorage.removeItem(storageKey)
    } catch (error) {
      console.warn("Failed to clear persisted form data:", error)
    }
  }, [storageKey])

  return {
    clearPersistedData
  }
}