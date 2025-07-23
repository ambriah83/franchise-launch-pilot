import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { 
  Package,
  Search,
  Filter,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  Minus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

const mockInventoryItems = [
  {
    id: 1,
    sku: "CHAIR-001",
    itemName: "Dining Chair - Standard",
    category: "Furniture",
    warehouse: "Atlanta Central",
    quantityOnHand: 45,
    quantityCommitted: 30,
    reorderLevel: 20,
    unitCost: 85
  },
  {
    id: 2,
    sku: "GRILL-PRO-500",
    itemName: "Commercial Grill Pro 500",
    category: "Kitchen Equipment", 
    warehouse: "Chicago Main",
    quantityOnHand: 8,
    quantityCommitted: 12,
    reorderLevel: 5,
    unitCost: 4500
  },
  {
    id: 3,
    sku: "TABLE-ROUND-48",
    itemName: "Round Table 48 inch",
    category: "Furniture",
    warehouse: "Dallas Hub",
    quantityOnHand: 22,
    quantityCommitted: 8,
    reorderLevel: 15,
    unitCost: 320
  },
  {
    id: 4,
    sku: "POS-TABLET-10",
    itemName: "POS Tablet 10 inch",
    category: "Technology",
    warehouse: "Atlanta Central",
    quantityOnHand: 3,
    quantityCommitted: 6,
    reorderLevel: 10,
    unitCost: 450
  }
]

export default function Inventory() {
  const { toast } = useToast()
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

  const getStockStatus = (onHand: number, committed: number, reorderLevel: number) => {
    const available = onHand - committed
    if (available <= 0) return { status: 'Out of Stock', color: 'bg-destructive', icon: Minus }
    if (available <= reorderLevel) return { status: 'Low Stock', color: 'bg-warning', icon: AlertTriangle }
    return { status: 'In Stock', color: 'bg-success', icon: TrendingUp }
  }

  const getStockProgress = (onHand: number, committed: number) => {
    if (onHand === 0) return 0
    return ((onHand - committed) / onHand) * 100
  }

  const handleExport = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Export Complete",
        description: "Inventory data exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export inventory data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleAddItem = () => {
    toast({
      title: "Add Inventory Item",
      description: "Item creation form would open here.",
    })
  }

  const handleFilter = () => {
    toast({
      title: "Filter Options",
      description: "Filter panel would open here.",
    })
  }

  const handleViewDetails = (itemId: number) => {
    toast({
      title: "Item Details",
      description: `Loading details for item ${itemId}...`,
    })
  }

  const handleReorder = (itemId: number) => {
    toast({
      title: "Reorder Item",
      description: `Creating reorder request for item ${itemId}...`,
    })
  }

  const filteredItems = mockInventoryItems.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.warehouse.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory</h1>
          <p className="text-muted-foreground">
            Track stock levels across all warehouse locations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
            {isLoading ? "Exporting..." : "Export"}
          </Button>
          <Button onClick={handleAddItem}>
            Add Item
          </Button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search inventory..."
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

      {/* Inventory List */}
      <div className="space-y-4">
        {filteredItems.map((item) => {
          const available = item.quantityOnHand - item.quantityCommitted
          const stockInfo = getStockStatus(item.quantityOnHand, item.quantityCommitted, item.reorderLevel)
          const progressValue = getStockProgress(item.quantityOnHand, item.quantityCommitted)
          const IconComponent = stockInfo.icon
          
          return (
            <Card key={item.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{item.itemName}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>SKU: {item.sku}</span>
                      <span>Category: {item.category}</span>
                      <span>Warehouse: {item.warehouse}</span>
                    </CardDescription>
                  </div>
                  <Badge className={stockInfo.color}>
                    <IconComponent className="h-3 w-3 mr-1" />
                    {stockInfo.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Stock Levels */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Stock Levels</div>
                    <div className="space-y-1 text-sm">
                      <div>On Hand: <span className="font-medium">{item.quantityOnHand}</span></div>
                      <div>Committed: <span className="font-medium">{item.quantityCommitted}</span></div>
                      <div>Available: <span className="font-medium">{available}</span></div>
                    </div>
                  </div>
                  
                  {/* Availability Progress */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Availability</div>
                    <Progress value={progressValue} className="h-2" />
                    <div className="text-xs text-muted-foreground">
                      {progressValue.toFixed(1)}% available
                    </div>
                  </div>
                  
                  {/* Financial Info */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Value</div>
                    <div className="space-y-1 text-sm">
                      <div>Unit Cost: <span className="font-medium">{formatCurrency(item.unitCost)}</span></div>
                      <div>Total Value: <span className="font-medium">{formatCurrency(item.quantityOnHand * item.unitCost)}</span></div>
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(item.id)}>
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => handleReorder(item.id)}>
                      Reorder
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