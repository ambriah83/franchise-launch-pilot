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
  Send
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function CreatePurchaseOrder() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [selectedProject, setSelectedProject] = useState("")
  const [selectedSupplier, setSelectedSupplier] = useState("")
  const [notes, setNotes] = useState("")

  const handleSaveDraft = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Draft Saved",
        description: "Purchase order draft has been saved successfully.",
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
    if (!selectedProject || !selectedSupplier) {
      toast({
        title: "Missing Information",
        description: "Please select both project and supplier before submitting.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1500))
      toast({
        title: "Order Submitted",
        description: "Purchase order has been submitted successfully.",
      })
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

  const handleAddItem = () => {
    toast({
      title: "Add Item",
      description: "Item selection dialog would open here.",
    })
  }

  const handleLoadTemplate = () => {
    toast({
      title: "Load Template",
      description: "Template selection would open here.",
    })
  }

  const handleCopyPrevious = () => {
    toast({
      title: "Copy Previous Order",
      description: "Previous order selection would open here.",
    })
  }

  const handleImportCatalog = () => {
    toast({
      title: "Import from Catalog",
      description: "Catalog import dialog would open here.",
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
                      <SelectItem value="downtown-chicago">Downtown Chicago</SelectItem>
                      <SelectItem value="westside-atlanta">Westside Atlanta</SelectItem>
                      <SelectItem value="brooklyn-heights">Brooklyn Heights</SelectItem>
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
                      <SelectItem value="restaurant-depot">Restaurant Depot Inc.</SelectItem>
                      <SelectItem value="kitchen-solutions">Kitchen Solutions LLC</SelectItem>
                      <SelectItem value="commercial-furniture">Commercial Furniture Co.</SelectItem>
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
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle>Order Items</CardTitle>
                  <CardDescription>Add items to this purchase order</CardDescription>
                </div>
                <Button variant="outline" size="sm" onClick={handleAddItem}>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              <div className="border rounded-lg p-4 text-center text-muted-foreground">
                <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>No items added yet</p>
                <p className="text-sm">Click "Add Item" to start building your order</p>
              </div>
            </CardContent>
          </Card>
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
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Tax:</span>
                <span>$0.00</span>
              </div>
              <div className="flex justify-between">
                <span>Shipping:</span>
                <span>$0.00</span>
              </div>
              <div className="border-t pt-4">
                <div className="flex justify-between font-semibold">
                  <span>Total:</span>
                  <span>$0.00</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button variant="outline" className="w-full justify-start" onClick={handleLoadTemplate}>
                Load from Template
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleCopyPrevious}>
                Copy from Previous Order
              </Button>
              <Button variant="outline" className="w-full justify-start" onClick={handleImportCatalog}>
                Import from Catalog
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}