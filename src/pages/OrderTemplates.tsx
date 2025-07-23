import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Package,
  Search,
  Plus,
  Copy,
  Edit,
  Trash2
} from "lucide-react"
import { useLocalStorageData } from "@/hooks/useLocalStorage"
import { localStorageService } from "@/services/localStorageService"
import { useToast } from "@/hooks/use-toast"
import OrderTemplateForm from "@/components/forms/OrderTemplateForm"
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog"
import { OrderKit } from "@/types"

export default function OrderTemplates() {
  const { toast } = useToast()
  const { data: templates, refreshData } = useLocalStorageData<OrderKit>(
    'orderKits',
    () => localStorageService.getOrderKits(),
    []
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingTemplate, setEditingTemplate] = useState<OrderKit | undefined>()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [templateToDelete, setTemplateToDelete] = useState<OrderKit | undefined>()

  const filteredTemplates = useMemo(() => {
    if (!searchTerm) return templates
    
    return templates.filter(template =>
      template.kitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      template.category.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [templates, searchTerm])

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Complete Setup': return 'bg-primary'
      case 'Kitchen': return 'bg-warning'
      case 'Furniture': return 'bg-info'
      case 'Technology': return 'bg-success'
      default: return 'bg-muted'
    }
  }

  const handleCreateTemplate = () => {
    setEditingTemplate(undefined)
    setFormOpen(true)
  }

  const handleEditTemplate = (template: OrderKit) => {
    setEditingTemplate(template)
    setFormOpen(true)
  }

  const handleDeleteTemplate = (template: OrderKit) => {
    setTemplateToDelete(template)
    setDeleteDialogOpen(true)
  }

  const confirmDelete = () => {
    if (templateToDelete) {
      localStorageService.deleteOrderKit(templateToDelete.id)
      toast({
        title: "Success",
        description: "Template deleted successfully"
      })
      refreshData()
    }
    setDeleteDialogOpen(false)
    setTemplateToDelete(undefined)
  }

  const handleUseTemplate = (template: OrderKit) => {
    toast({
      title: "Template Selected",
      description: `${template.kitName} will be used for new purchase order`
    })
    // TODO: Integrate with Create Purchase Order page
  }

  const handleFormSuccess = () => {
    refreshData()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Templates</h1>
          <p className="text-muted-foreground">
            Pre-configured order templates for quick franchise setup
          </p>
        </div>
        <Button onClick={handleCreateTemplate}>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.kitName}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge className={getCategoryColor(template.category)}>
                {template.category}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Template Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Items:</span>
                  <div className="font-medium">{template.lineItems?.length || 0} items</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Cost:</span>
                  <div className="font-medium">{formatCurrency(template.estimatedCost || 0)}</div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleUseTemplate(template)}>
                  <Copy className="h-3 w-3 mr-1" />
                  Use Template
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditTemplate(template)}>
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleDeleteTemplate(template)}>
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <OrderTemplateForm
        open={formOpen}
        onOpenChange={setFormOpen}
        template={editingTemplate}
        onSuccess={handleFormSuccess}
      />

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Template</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete "{templateToDelete?.kitName}"? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}