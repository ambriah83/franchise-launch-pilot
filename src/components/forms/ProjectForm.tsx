import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { format } from "date-fns"
import { CalendarIcon } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { Project, ProjectStatus } from "../../types"
import { localStorageService } from "../../services/localStorageService"
import { useToast } from "@/hooks/use-toast"
import { projectSchema } from "@/schemas/validationSchemas"
import { useEffect, useState } from "react"

interface ProjectFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  project?: Project
  onSuccess: () => void
}

export function ProjectForm({ open, onOpenChange, project, onSuccess }: ProjectFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(projectSchema),
    defaultValues: {
      locationName: project?.locationName || "",
      status: project?.status || "Planning" as ProjectStatus,
      targetOpeningDate: project?.targetOpeningDate || new Date(),
      totalBudget: project?.totalBudget || 0,
      notes: ""
    }
  })

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      form.reset({
        locationName: project.locationName,
        status: project.status,
        targetOpeningDate: project.targetOpeningDate,
        totalBudget: project.totalBudget,
        notes: ""
      })
    } else {
      form.reset({
        locationName: "",
        status: "Planning",
        targetOpeningDate: new Date(),
        totalBudget: 0,
        notes: ""
      })
    }
  }, [project, form])

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const projectData = {
        locationName: data.locationName.trim(),
        projectManagerId: "1", // Default to Sarah Chen
        status: data.status,
        targetOpeningDate: data.targetOpeningDate,
        totalBudget: data.totalBudget,
        totalCommitted: project?.totalCommitted || 0,
        totalSpent: project?.totalSpent || 0,
        budgetVariance: project?.budgetVariance || data.totalBudget
      }

      if (project) {
        localStorageService.updateProject(project.id, projectData)
        toast({
          title: "Project Updated",
          description: `${data.locationName} has been updated successfully.`
        })
      } else {
        localStorageService.createProject(projectData)
        toast({
          title: "Project Created",
          description: `${data.locationName} has been added to your projects.`
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>
            {project ? "Edit Project" : "Create New Project"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="locationName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Location Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Queen Creek, Mesa East"
                        {...field}
                        className={form.formState.errors.locationName ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Planning">Planning</SelectItem>
                        <SelectItem value="In Progress">In Progress</SelectItem>
                        <SelectItem value="On Hold">On Hold</SelectItem>
                        <SelectItem value="Completed">Completed</SelectItem>
                        <SelectItem value="Cancelled">Cancelled</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="targetOpeningDate"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Target Opening Date *</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full pl-3 text-left font-normal",
                              !field.value && "text-muted-foreground",
                              form.formState.errors.targetOpeningDate && "border-destructive"
                            )}
                          >
                            {field.value ? (
                              format(field.value, "PPP")
                            ) : (
                              <span>Pick a date</span>
                            )}
                            <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                          </Button>
                        </FormControl>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) => date < new Date()}
                          initialFocus
                          className="pointer-events-auto"
                        />
                      </PopoverContent>
                    </Popover>
                    <FormDescription>
                      The planned opening date for this location
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="totalBudget"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Total Budget ($) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="1000"
                        placeholder="250000"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className={form.formState.errors.totalBudget ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Total allocated budget for this project
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Notes</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Additional project details, requirements, or notes..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional notes and additional information about this project
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (project ? "Update Project" : "Create Project")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}