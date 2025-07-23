import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { localStorageService } from "@/services/localStorageService"
import { OrderKit } from "@/types"
import { orderKitSchema } from "@/schemas/validationSchemas"
import { useEffect, useState } from "react"

interface OrderTemplateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: OrderKit
  onSuccess: () => void
}

export default function OrderTemplateForm({ open, onOpenChange, template, onSuccess }: OrderTemplateFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(orderKitSchema),
    defaultValues: {
      kitName: template?.kitName || "",
      description: template?.description || "",
      category: template?.category || "",
      estimatedCost: template?.estimatedCost || 0
    }
  })

  // Reset form when template changes
  useEffect(() => {
    if (template) {
      form.reset({
        kitName: template.kitName,
        description: template.description,
        category: template.category,
        estimatedCost: template.estimatedCost
      })
    } else {
      form.reset({
        kitName: "",
        description: "",
        category: "",
        estimatedCost: 0
      })
    }
  }, [template, form])

  const categories = [
    "Complete Setup",
    "Kitchen",
    "Furniture", 
    "Technology",
    "Fixtures",
    "Equipment"
  ]

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      if (template) {
        localStorageService.updateOrderKit(template.id, data)
        toast({
          title: "Template Updated",
          description: `${data.kitName} has been updated successfully.`
        })
      } else {
        localStorageService.createOrderKit({
          ...data,
          lineItems: []
        })
        toast({
          title: "Template Created",
          description: `${data.kitName} has been created successfully.`
        })
      }

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template. Please try again.",
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
      <DialogContent className="sm:max-w-[500px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{template ? "Edit Template" : "Create Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update template details" : "Create a new order template for franchise setups"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="kitName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Template Name *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter template name..."
                      {...field}
                      className={form.formState.errors.kitName ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Describe this template..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Provide a detailed description of what this template includes
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={form.formState.errors.category ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select category..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {categories.map((category) => (
                        <SelectItem key={category} value={category}>
                          {category}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="estimatedCost"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Estimated Cost</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className={form.formState.errors.estimatedCost ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Estimated total cost for this template (USD)
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : template ? "Update Template" : "Create Template"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}