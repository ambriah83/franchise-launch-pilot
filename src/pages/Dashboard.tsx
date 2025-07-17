import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  DollarSign, 
  ShoppingCart, 
  Package, 
  AlertTriangle, 
  TrendingUp, 
  TrendingDown,
  Calendar,
  Truck,
  FileText,
  ArrowUpRight,
  ArrowDownRight,
  Clock
} from "lucide-react"
import { 
  mockDashboardStats, 
  mockBudgetAnalysis, 
  mockInventoryAlerts, 
  mockProjects,
  mockPurchaseOrders,
  getProjectById,
  getUserById 
} from "@/data/mockData"

export default function Dashboard() {
  const stats = mockDashboardStats
  const budgetAnalysis = mockBudgetAnalysis
  const alerts = mockInventoryAlerts
  const recentProjects = mockProjects.slice(0, 3)
  const recentPOs = mockPurchaseOrders.slice(0, 4)

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
      case 'completed': return 'bg-success'
      case 'in progress': return 'bg-primary'
      case 'planning': return 'bg-warning'
      case 'on hold': return 'bg-muted'
      case 'ordered': return 'bg-info'
      case 'shipped': return 'bg-primary'
      case 'partially shipped': return 'bg-warning'
      case 'received': return 'bg-success'
      case 'draft': return 'bg-muted'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">
            Franchise Launch Operations Overview
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Export Report
          </Button>
          <Button>
            <Building2 className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <Building2 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalProjects}</div>
            <p className="text-xs text-muted-foreground">
              {stats.activeProjects} active locations
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Budget</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(stats.totalBudget)}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              {formatCurrency(stats.budgetVariance)} remaining
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Orders</CardTitle>
            <ShoppingCart className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.pendingPOs}</div>
            <p className="text-xs text-warning flex items-center">
              <Clock className="h-3 w-3 mr-1" />
              {stats.overdueDeliveries} overdue deliveries
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Inventory Alerts</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.lowStockItems}</div>
            <p className="text-xs text-destructive flex items-center">
              <AlertTriangle className="h-3 w-3 mr-1" />
              Requires attention
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Budget Analysis */}
        <Card>
          <CardHeader>
            <CardTitle>Budget Analysis</CardTitle>
            <CardDescription>Project spending overview</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {budgetAnalysis.map((project) => (
              <div key={project.projectId} className="space-y-2">
                <div className="flex items-center justify-between">
                  <div className="font-medium">{project.projectName}</div>
                  <div className="text-sm text-muted-foreground">
                    {project.variancePercentage}% remaining
                  </div>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>Spent: {formatCurrency(project.spent)}</span>
                  <span>Budget: {formatCurrency(project.budget)}</span>
                </div>
                <Progress 
                  value={(project.spent / project.budget) * 100} 
                  className="h-2"
                />
              </div>
            ))}
          </CardContent>
        </Card>

        {/* Inventory Alerts */}
        <Card>
          <CardHeader>
            <CardTitle>Inventory Alerts</CardTitle>
            <CardDescription>Items requiring attention</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {alerts.map((alert) => (
              <div key={alert.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <AlertTriangle className={`h-4 w-4 ${
                    alert.severity === 'High' ? 'text-destructive' : 
                    alert.severity === 'Medium' ? 'text-warning' : 'text-muted-foreground'
                  }`} />
                  <div>
                    <div className="font-medium">{alert.itemName}</div>
                    <div className="text-sm text-muted-foreground">
                      {alert.warehouseName} • Stock: {alert.currentStock}
                    </div>
                  </div>
                </div>
                <Badge variant={alert.severity === 'High' ? 'destructive' : 'secondary'}>
                  {alert.type.replace('_', ' ')}
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Projects */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Projects</CardTitle>
            <CardDescription>Latest franchise locations</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentProjects.map((project) => {
              const manager = getUserById(project.projectManagerId)
              return (
                <div key={project.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{project.locationName}</div>
                    <div className="text-sm text-muted-foreground">
                      PM: {manager?.name}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Target: {project.targetOpeningDate.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(project.status)}>
                      {project.status}
                    </Badge>
                    <div className="text-sm font-medium">
                      {formatCurrency(project.totalBudget)}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>

        {/* Recent Purchase Orders */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Purchase Orders</CardTitle>
            <CardDescription>Latest procurement activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {recentPOs.map((po) => {
              const project = getProjectById(po.projectId)
              return (
                <div key={po.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{po.poNumber}</div>
                    <div className="text-sm text-muted-foreground">
                      {project?.locationName}
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Created: {po.dateCreated.toLocaleDateString()}
                    </div>
                  </div>
                  <div className="text-right space-y-1">
                    <Badge className={getStatusColor(po.status)}>
                      {po.status}
                    </Badge>
                    <div className="text-sm font-medium">
                      {formatCurrency(po.totalCost)}
                    </div>
                  </div>
                </div>
              )
            })}
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Common tasks and shortcuts</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Building2 className="h-6 w-6" />
              <span className="text-sm">New Project</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <ShoppingCart className="h-6 w-6" />
              <span className="text-sm">Create PO</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Truck className="h-6 w-6" />
              <span className="text-sm">Log Delivery</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col gap-2">
              <Package className="h-6 w-6" />
              <span className="text-sm">Check Inventory</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}