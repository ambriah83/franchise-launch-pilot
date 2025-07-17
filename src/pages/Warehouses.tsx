import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Warehouse,
  Search,
  Plus,
  MapPin,
  User,
  Package,
  TrendingUp
} from "lucide-react"
import { mockWarehouses } from "@/data/mockData"

export default function Warehouses() {
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
        <Button>
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
                  <Button variant="outline" size="sm" className="flex-1">
                    View Inventory
                  </Button>
                  <Button size="sm" className="flex-1">
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}