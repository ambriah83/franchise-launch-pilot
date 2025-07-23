import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { 
  Warehouse,
  Search,
  Plus,
  MapPin,
  User,
  Package,
  TrendingUp,
  Eye,
  Settings,
  Building2,
  BarChart3,
  Users
} from "lucide-react"
import { mockWarehouses, mockCatalogItems } from "@/data/mockData"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Warehouses() {
  const { toast } = useToast()
  const [viewInventory, setViewInventory] = useState(null)
  const [manageWarehouse, setManageWarehouse] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    warehouseName: '',
    address: '',
    regionalManagerId: '',
    capacity: 1000
  })

  // Mock inventory counts for each warehouse
  const getInventoryStats = (warehouseId: string) => {
    const stats = {
      'WH-ATL-001': { totalItems: 1250, totalValue: 485000, utilizationRate: 78 },
      'WH-CHI-001': { totalItems: 980, totalValue: 392000, utilizationRate: 65 },
      'WH-DAL-001': { totalItems: 850, totalValue: 340000, utilizationRate: 82 },
      'WH-NYC-001': { totalItems: 750, totalValue: 298000, utilizationRate: 58 }
    }
    return stats[warehouseId] || { totalItems: 0, totalValue: 0, utilizationRate: 0 }
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getUtilizationColor = (rate: number) => {
    if (rate >= 80) return 'bg-warning'
    if (rate >= 60) return 'bg-success'
    return 'bg-info'
  }

  const handleViewInventory = (warehouse) => {
    setViewInventory(warehouse)
  }

  const handleManageWarehouse = (warehouse) => {
    setManageWarehouse(warehouse)
  }

  const handleAddWarehouse = () => {
    setShowAddDialog(true)
    setFormData({
      warehouseName: '',
      address: '',
      regionalManagerId: '',
      capacity: 1000
    })
  }

  const handleSaveWarehouse = () => {
    if (!formData.warehouseName || !formData.address || !formData.regionalManagerId) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    toast({
      title: "Warehouse Added",
      description: `${formData.warehouseName} has been added successfully.`
    })
    setShowAddDialog(false)
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const getWarehouseInventory = (warehouseId) => {
    // Return mock inventory items for the warehouse
    return mockCatalogItems.slice(0, 5).map((item, index) => ({
      ...item,
      id: `${warehouseId}-${item.id}`,
      quantity: Math.floor(Math.random() * 100) + 10,
      location: `Section ${String.fromCharCode(65 + index)}`,
      unitPrice: item.defaultUnitPrice
    }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Warehouses</h1>
          <p className="text-muted-foreground">
            Manage warehouse locations and inventory distribution
          </p>
        </div>
        <Button onClick={handleAddWarehouse}>
          <Plus className="h-4 w-4 mr-2" />
          Add Warehouse
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search warehouses..."
          className="pl-10"
        />
      </div>

      {/* Warehouse Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Warehouse className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{mockWarehouses.length}</div>
                <div className="text-sm text-muted-foreground">Total Locations</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-info" />
              <div>
                <div className="text-2xl font-bold">3,830</div>
                <div className="text-sm text-muted-foreground">Total Items</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <TrendingUp className="h-5 w-5 text-success" />
              <div>
                <div className="text-2xl font-bold">$1.5M</div>
                <div className="text-sm text-muted-foreground">Total Value</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Warehouse className="h-5 w-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">71%</div>
                <div className="text-sm text-muted-foreground">Avg Utilization</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Warehouses Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {mockWarehouses.map((warehouse) => {
          const stats = getInventoryStats(warehouse.id)
          
          return (
            <Card key={warehouse.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{warehouse.warehouseName}</CardTitle>
                    <CardDescription className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="line-clamp-2">{warehouse.address}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getUtilizationColor(stats.utilizationRate)}>
                    {stats.utilizationRate}% Utilized
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Regional Manager */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Manager: {warehouse.regionalManagerId}</span>
                </div>
                
                {/* Inventory Stats */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Total Items</div>
                    <div className="text-xl font-bold">{stats.totalItems.toLocaleString()}</div>
                  </div>
                  <div className="space-y-1">
                    <div className="text-sm text-muted-foreground">Inventory Value</div>
                    <div className="text-xl font-bold">{formatCurrency(stats.totalValue)}</div>
                  </div>
                </div>
                
                {/* Utilization Bar */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Capacity Utilization</span>
                    <span>{stats.utilizationRate}%</span>
                  </div>
                  <div className="w-full bg-muted rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        stats.utilizationRate >= 80 ? 'bg-warning' :
                        stats.utilizationRate >= 60 ? 'bg-success' : 'bg-info'
                      }`}
                      style={{ width: `${stats.utilizationRate}%` }}
                    />
                  </div>
                </div>
                
                {/* Actions */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewInventory(warehouse)}>
                    <Eye className="h-4 w-4 mr-1" />
                    View Inventory
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleManageWarehouse(warehouse)}>
                    <Settings className="h-4 w-4 mr-1" />
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* View Inventory Dialog */}
      <Dialog open={!!viewInventory} onOpenChange={() => setViewInventory(null)}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Package className="h-5 w-5" />
              {viewInventory?.warehouseName} - Inventory
            </DialogTitle>
            <DialogDescription>
              Current inventory items and their locations within the warehouse
            </DialogDescription>
          </DialogHeader>
          
          {viewInventory && (
            <div className="space-y-4">
              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-info">{getInventoryStats(viewInventory.id).totalItems}</div>
                  <div className="text-sm text-muted-foreground">Total Items</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-success">{formatCurrency(getInventoryStats(viewInventory.id).totalValue)}</div>
                  <div className="text-sm text-muted-foreground">Total Value</div>
                </div>
                <div className="text-center p-3 bg-muted/50 rounded-lg">
                  <div className="text-2xl font-bold text-warning">{getInventoryStats(viewInventory.id).utilizationRate}%</div>
                  <div className="text-sm text-muted-foreground">Utilization</div>
                </div>
              </div>
              
              <div className="space-y-2">
                <h4 className="font-medium">Inventory Items</h4>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Item Name</TableHead>
                      <TableHead>SKU</TableHead>
                      <TableHead>Quantity</TableHead>
                      <TableHead>Location</TableHead>
                      <TableHead>Unit Price</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {getWarehouseInventory(viewInventory.id).map((item) => (
                      <TableRow key={item.id}>
                        <TableCell className="font-medium">{item.itemName}</TableCell>
                        <TableCell>{item.sku}</TableCell>
                        <TableCell>{item.quantity}</TableCell>
                        <TableCell>{item.location}</TableCell>
                        <TableCell>{formatCurrency(item.unitPrice)}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Manage Warehouse Dialog */}
      <Dialog open={!!manageWarehouse} onOpenChange={() => setManageWarehouse(null)}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              Manage {manageWarehouse?.warehouseName}
            </DialogTitle>
            <DialogDescription>
              Administrative tools and bulk operations for warehouse management
            </DialogDescription>
          </DialogHeader>
          
          {manageWarehouse && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <h4 className="font-medium">Warehouse Information</h4>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Manager:</span>
                      <span>{manageWarehouse.regionalManagerId}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Location:</span>
                      <span className="text-right text-sm">{manageWarehouse.address}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Capacity:</span>
                      <span>{getInventoryStats(manageWarehouse.id).utilizationRate}% utilized</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h4 className="font-medium">Quick Actions</h4>
                  <div className="grid gap-2">
                    <Button variant="outline" size="sm" className="justify-start">
                      <BarChart3 className="h-4 w-4 mr-2" />
                      Generate Report
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Users className="h-4 w-4 mr-2" />
                      Manage Staff
                    </Button>
                    <Button variant="outline" size="sm" className="justify-start">
                      <Package className="h-4 w-4 mr-2" />
                      Bulk Operations
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Recent Activity</h4>
                <div className="space-y-2">
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm">Inventory cycle count completed</span>
                    <span className="text-xs text-muted-foreground">2 hours ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm">Staff training session scheduled</span>
                    <span className="text-xs text-muted-foreground">1 day ago</span>
                  </div>
                  <div className="flex justify-between items-center p-2 bg-muted/50 rounded">
                    <span className="text-sm">New equipment installation</span>
                    <span className="text-xs text-muted-foreground">3 days ago</span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Add Warehouse Dialog */}
      <Dialog open={showAddDialog} onOpenChange={setShowAddDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Add New Warehouse</DialogTitle>
            <DialogDescription>
              Create a new warehouse location for inventory distribution
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="warehouseName">Warehouse Name *</Label>
              <Input
                id="warehouseName"
                value={formData.warehouseName}
                onChange={(e) => handleFormChange('warehouseName', e.target.value)}
                placeholder="Enter warehouse name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="manager">Regional Manager *</Label>
              <Input
                id="manager"
                value={formData.regionalManagerId}
                onChange={(e) => handleFormChange('regionalManagerId', e.target.value)}
                placeholder="Enter manager name"
              />
            </div>
            
            <div className="space-y-2 col-span-2">
              <Label htmlFor="capacity">Storage Capacity (sq ft)</Label>
              <Input
                id="capacity"
                type="number"
                min="100"
                value={formData.capacity}
                onChange={(e) => handleFormChange('capacity', parseInt(e.target.value))}
                placeholder="Enter storage capacity"
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address *</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              placeholder="Enter complete warehouse address"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowAddDialog(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveWarehouse}>
              Add Warehouse
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}