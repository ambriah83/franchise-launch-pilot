import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  ShoppingCart, 
  Search,
  Filter,
  Plus,
  FileText,
  Calendar,
  DollarSign
} from "lucide-react"
import { mockPurchaseOrders, getProjectById, getSupplierById } from "@/data/mockData"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function PurchaseOrders() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'ordered': return 'bg-info'
      case 'shipped': return 'bg-primary'
      case 'partially shipped': return 'bg-warning'
      case 'received': return 'bg-success'
      case 'draft': return 'bg-muted'
      case 'cancelled': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const handleExport = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Export Complete",
        description: "Purchase orders exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export purchase orders.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleCreateOrder = () => {
    navigate('/create-purchase-order')
  }

  const handleFilter = () => {
    toast({
      title: "Filters",
      description: "Filter options would open here.",
    })
  }

  const handleViewDetails = (poId: string) => {
    toast({
      title: "PO Details",
      description: `Loading details for PO ${poId}...`,
    })
  }

  const handleEdit = (poId: string) => {
    toast({
      title: "Edit PO",
      description: `Opening editor for PO ${poId}...`,
    })
  }

  const filteredPOs = mockPurchaseOrders.filter(po => 
    po.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getProjectById(po.projectId)?.locationName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    getSupplierById(po.supplierId)?.supplierName.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Purchase Orders</h1>
          <p className="text-muted-foreground">
            Manage procurement across all franchise locations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
            <FileText className="h-4 w-4 mr-2" />
            {isLoading ? "Exporting..." : "Export"}
          </Button>
          <Button onClick={handleCreateOrder}>
            <Plus className="h-4 w-4 mr-2" />
            Create Order
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search purchase orders..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline" onClick={handleFilter}>
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Purchase Orders List */}
      <div className="space-y-4">
        {filteredPOs.map((po) => {
          const project = getProjectById(po.projectId)
          const supplier = getSupplierById(po.supplierId)
          
          return (
            <Card key={po.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{po.poNumber}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>Project: {project?.locationName}</span>
                      <span>Supplier: {supplier?.supplierName}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(po.status)}>
                    {po.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* Order Details */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm">Created: {po.dateCreated.toLocaleDateString()}</span>
                    </div>
                    {po.dateOrdered && (
                      <div className="flex items-center gap-2">
                        <Calendar className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm">Ordered: {po.dateOrdered.toLocaleDateString()}</span>
                      </div>
                    )}
                  </div>
                  
                  {/* Financial Info */}
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <DollarSign className="h-4 w-4 text-muted-foreground" />
                      <span className="text-sm font-medium">Total: {formatCurrency(po.totalCost)}</span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      0 items
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex gap-2 justify-end">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(po.id)}>
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => handleEdit(po.id)}>
                      Edit
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}