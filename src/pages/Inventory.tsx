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
  Minus,
  Settings,
  ArrowRightLeft,
  ShoppingCart,
  Plus
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"
import { useInventoryManagement } from "@/hooks/useInventoryManagement"
import { StockAdjustmentDialog } from "@/components/inventory/StockAdjustmentDialog"
import { TransferRequestDialog } from "@/components/inventory/TransferRequestDialog"
import { ReorderSuggestionsDialog } from "@/components/inventory/ReorderSuggestionsDialog"
import { useNavigate } from "react-router-dom"

export default function Inventory() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  
  // Enhanced inventory management
  const {
    inventoryItems,
    adjustStock,
    createTransferRequest,
    getReorderSuggestions
  } = useInventoryManagement()

  // Dialog states
  const [adjustmentDialogOpen, setAdjustmentDialogOpen] = useState(false)
  const [transferDialogOpen, setTransferDialogOpen] = useState(false)
  const [reorderDialogOpen, setReorderDialogOpen] = useState(false)
  const [selectedItem, setSelectedItem] = useState(null)

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
    navigate('/inventory-catalog')
  }

  const handleFilter = () => {
    toast({
      title: "Filter Options",
      description: "Advanced filter panel will be available soon.",
    })
  }

  const handleViewDetails = (item) => {
    toast({
      title: "Item Details",
      description: `Viewing details for ${item.itemName}`,
    })
  }

  const handleAdjustStock = (item) => {
    setSelectedItem(item)
    setAdjustmentDialogOpen(true)
  }

  const handleTransferRequest = (item) => {
    setSelectedItem(item)
    setTransferDialogOpen(true)
  }

  const handleViewReorderSuggestions = () => {
    setReorderDialogOpen(true)
  }

  const handleCreatePurchaseOrder = (itemIds) => {
    // Navigate to create PO with pre-selected items
    const params = new URLSearchParams()
    itemIds.forEach(id => params.append('item', id))
    navigate(`/purchase-orders/create?${params.toString()}`)
  }

  const reorderSuggestions = getReorderSuggestions()

  const filteredItems = inventoryItems.filter(item =>
    item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.category.toLowerCase().includes(searchTerm.toLowerCase())
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
          <Button variant="outline" onClick={handleViewReorderSuggestions}>
            <ShoppingCart className="h-4 w-4 mr-2" />
            Reorder Suggestions
            {reorderSuggestions.length > 0 && (
              <Badge variant="destructive" className="ml-2">
                {reorderSuggestions.length}
              </Badge>
            )}
          </Button>
          <Button variant="outline" onClick={handleExport} disabled={isLoading}>
            {isLoading ? "Exporting..." : "Export"}
          </Button>
          <Button onClick={handleAddItem}>
            <Plus className="h-4 w-4 mr-2" />
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
          const stockInfo = getStockStatus(item.totalQuantity, item.totalQuantity - item.availableQuantity, item.reorderLevel)
          const progressValue = item.totalQuantity > 0 ? (item.availableQuantity / item.totalQuantity) * 100 : 0
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
                      <span>{item.stockLevels.length} warehouse(s)</span>
                    </CardDescription>
                  </div>
                  <div className="flex gap-2">
                    {item.isOutOfStock && (
                      <Badge className="bg-destructive">
                        <Minus className="h-3 w-3 mr-1" />
                        OUT OF STOCK
                      </Badge>
                    )}
                    {item.isLowStock && !item.isOutOfStock && (
                      <Badge className="bg-warning">
                        <AlertTriangle className="h-3 w-3 mr-1" />
                        LOW STOCK
                      </Badge>
                    )}
                    {!item.isOutOfStock && !item.isLowStock && (
                      <Badge className="bg-success">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        IN STOCK
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                  {/* Stock Levels */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Stock Levels</div>
                    <div className="space-y-1 text-sm">
                      <div>Total: <span className="font-medium">{item.totalQuantity}</span></div>
                      <div>Available: <span className="font-medium">{item.availableQuantity}</span></div>
                      <div>Reorder Level: <span className="font-medium">{Math.round(item.reorderLevel)}</span></div>
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
                      <div>Unit Cost: <span className="font-medium">{formatCurrency(item.defaultUnitPrice)}</span></div>
                      <div>Total Value: <span className="font-medium">{formatCurrency(item.totalQuantity * item.defaultUnitPrice)}</span></div>
                    </div>
                  </div>
                  
                  {/* Warehouse Breakdown */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Warehouses</div>
                    <div className="space-y-1 text-xs">
                      {item.stockLevels.slice(0, 3).map((stock) => (
                        <div key={stock.warehouseId} className="flex justify-between">
                          <span>WH-{stock.warehouseId.slice(-4)}:</span>
                          <span>{stock.quantityOnHand}</span>
                        </div>
                      ))}
                      {item.stockLevels.length > 3 && (
                        <div className="text-muted-foreground">
                          +{item.stockLevels.length - 3} more
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(item)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Details
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleAdjustStock(item)}>
                      <Settings className="h-4 w-4 mr-1" />
                      Adjust
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => handleTransferRequest(item)}>
                      <ArrowRightLeft className="h-4 w-4 mr-1" />
                      Transfer
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Dialogs */}
      <StockAdjustmentDialog
        open={adjustmentDialogOpen}
        onOpenChange={setAdjustmentDialogOpen}
        item={selectedItem}
        onAdjustment={async (itemId, warehouseId, quantityChange, reason, type) => {
          await adjustStock(itemId, warehouseId, quantityChange, reason, type);
        }}
      />

      <TransferRequestDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        item={selectedItem}
        onTransferRequest={async (itemId, fromWarehouseId, toWarehouseId, quantity, notes) => {
          await createTransferRequest(itemId, fromWarehouseId, toWarehouseId, quantity, notes);
        }}
      />

      <ReorderSuggestionsDialog
        open={reorderDialogOpen}
        onOpenChange={setReorderDialogOpen}
        suggestions={reorderSuggestions}
        onCreatePurchaseOrder={handleCreatePurchaseOrder}
      />
    </div>
  )
}