import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { localStorageService } from "@/services/localStorageService"
import { OrderKit } from "@/types"

interface OrderTemplateFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  template?: OrderKit
  onSuccess: () => void
}

export default function OrderTemplateForm({ open, onOpenChange, template, onSuccess }: OrderTemplateFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    kitName: template?.kitName || "",
    description: template?.description || "",
    category: template?.category || "",
    estimatedCost: template?.estimatedCost || 0
  })

  const categories = [
    "Complete Setup",
    "Kitchen",
    "Furniture", 
    "Technology",
    "Fixtures",
    "Equipment"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.kitName.trim()) {
      toast({
        title: "Validation Error",
        description: "Template name is required",
        variant: "destructive"
      })
      return
    }

    if (!formData.category) {
      toast({
        title: "Validation Error", 
        description: "Category is required",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      if (template) {
        localStorageService.updateOrderKit(template.id, formData)
        toast({
          title: "Success",
          description: "Template updated successfully"
        })
      } else {
        localStorageService.createOrderKit({
          ...formData,
          lineItems: []
        })
        toast({
          title: "Success", 
          description: "Template created successfully"
        })
      }

      setFormData({
        kitName: "",
        description: "",
        category: "",
        estimatedCost: 0
      })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save template",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{template ? "Edit Template" : "Create Template"}</DialogTitle>
          <DialogDescription>
            {template ? "Update template details" : "Create a new order template for franchise setups"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="kitName">Template Name</Label>
            <Input
              id="kitName"
              value={formData.kitName}
              onChange={(e) => setFormData(prev => ({ ...prev, kitName: e.target.value }))}
              placeholder="Enter template name..."
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Describe this template..."
              rows={3}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="category">Category</Label>
            <Select value={formData.category} onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select category..." />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="estimatedCost">Estimated Cost</Label>
            <Input
              id="estimatedCost"
              type="number"
              value={formData.estimatedCost}
              onChange={(e) => setFormData(prev => ({ ...prev, estimatedCost: parseInt(e.target.value) || 0 }))}
              placeholder="0"
              min="0"
            />
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : template ? "Update Template" : "Create Template"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}