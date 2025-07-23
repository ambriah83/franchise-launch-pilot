import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { 
  Plus,
  ShoppingCart,
  Save,
  Send,
  FileText,
  Copy
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState, useEffect } from "react"
import { PurchaseOrderLineItems, PurchaseOrderLineItem } from "@/components/purchase-orders/PurchaseOrderLineItems"
import { OrderTemplateDialog } from "@/components/purchase-orders/OrderTemplateDialog"
import { Project, Supplier } from "@/types"
import { localStorageService } from "@/services/localStorageService"

export default function CreatePurchaseOrder() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [notes, setNotes] = useState("")
  const [lineItems, setLineItems] = useState<PurchaseOrderLineItem[]>([])
  const [showTemplateDialog, setShowTemplateDialog] = useState(false)
  const [projects, setProjects] = useState<Project[]>([])
  const [suppliers, setSuppliers] = useState<Supplier[]>([])

  useEffect(() => {
    setProjects(localStorageService.getProjects())
    setSuppliers(localStorageService.getSuppliers())
  }, [])

  const calculateTotals = () => {
    const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0)
    const taxRate = 0.0875 // 8.75% tax rate
    const tax = subtotal * taxRate
    const total = subtotal + tax
    
    return { subtotal, tax, total }
  }

  const { subtotal, tax, total } = calculateTotals()

  const handleSaveDraft = async () => {
    if (!selectedProject || lineItems.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select a project and add at least one item before saving.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Generate PO number
      const poNumber = `PO-${Date.now()}`
      
      // Create purchase order data
      const purchaseOrderData = {
        poNumber,
        poId: Date.now(),
        version: 1,
        projectId: selectedProject,
        supplierId: selectedSupplier || suppliers[0]?.id || "",
        status: 'Draft' as const,
        dateCreated: new Date(),
        totalCost: total,
        requestedDate: new Date()
      }

      // Save purchase order
      const savedPO = localStorageService.createPurchaseOrder(purchaseOrderData)
      
      // TODO: Save line items when we add line item support to localStorageService
      
      toast({
        title: "Draft Saved",
        description: `Purchase order ${poNumber} has been saved as draft.`,
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save purchase order draft.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleSubmitOrder = async () => {
    if (!selectedProject || !selectedSupplier || lineItems.length === 0) {
      toast({
        title: "Missing Information",
        description: "Please select project, supplier, and add items before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      // Generate PO number
      const poNumber = `PO-${Date.now()}`
      
      // Create purchase order data
      const purchaseOrderData = {
        poNumber,
        poId: Date.now(),
        version: 1,
        projectId: selectedProject,
        supplierId: selectedSupplier,
        status: 'Pending' as const,
        dateCreated: new Date(),
        totalCost: total,
        requestedDate: new Date()
      }

      // Save purchase order
      const savedPO = localStorageService.createPurchaseOrder(purchaseOrderData)
      
      // TODO: Save line items when we add line item support to localStorageService
      
      toast({
        title: "Order Submitted",
        description: `Purchase order ${poNumber} has been submitted successfully.`,
      })

      // Reset form
      setSelectedProject("")
      setSelectedSupplier("")
      setNotes("")
      setLineItems([])
    } catch (error) {
      toast({
        title: "Submission Failed",
        description: "Failed to submit purchase order.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleLoadTemplate = (templateItems: PurchaseOrderLineItem[]) => {
    // Replace existing items with template items
    setLineItems(templateItems)
    toast({
      title: "Template Loaded",
      description: `Added ${templateItems.length} items from template.`,
    })
  }

  const handleCopyPrevious = () => {
    toast({
      title: "Copy Previous Order",
      description: "Previous order selection would open here.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Create Purchase Order</h1>
          <p className="text-muted-foreground">
            Create a new purchase order for franchise equipment and supplies
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleSaveDraft} disabled={isLoading}>
            <Save className="h-4 w-4 mr-2" />
            {isLoading ? "Saving..." : "Save Draft"}
          </Button>
          <Button onClick={handleSubmitOrder} disabled={isLoading}>
            <Send className="h-4 w-4 mr-2" />
            {isLoading ? "Submitting..." : "Submit Order"}
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Information</CardTitle>
              <CardDescription>Basic purchase order details</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="project">Project Location</Label>
                  <Select value={selectedProject} onValueChange={setSelectedProject}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select project..." />
                    </SelectTrigger>
                    <SelectContent>
                      {projects.map(project => (
                        <SelectItem key={project.id} value={project.id}>
                          {project.locationName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="supplier">Supplier</Label>
                  <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select supplier..." />
                    </SelectTrigger>
                    <SelectContent>
                      {suppliers.map(supplier => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.supplierName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Order Notes</Label>
                <Textarea 
                  id="notes"
                  placeholder="Add any special instructions or notes for this order..."
                  rows={3}
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>
            </CardContent>
          </Card>

          {/* Line Items */}
          <PurchaseOrderLineItems
            lineItems={lineItems}
            onLineItemsChange={setLineItems}
            supplierId={selectedSupplier}
          />
        </div>

        {/* Order Summary */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <span>Subtotal:</span>
                <span>${subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Tax (8.75%):</span>
                <span>${tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>TBD</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold text-lg">
                  <span>Total:</span>
                  <span>${total.toFixed(2)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={() => setShowTemplateDialog(true)}
              >
                <FileText className="h-4 w-4 mr-2" />
                Load from Template
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleCopyPrevious}>
                <Copy className="h-4 w-4 mr-2" />
                Copy from Previous Order
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      <OrderTemplateDialog
        open={showTemplateDialog}
        onOpenChange={setShowTemplateDialog}
        onTemplateSelected={handleLoadTemplate}
      />
    </div>
  )
}