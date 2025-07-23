import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  AlertTriangle,
  Package,
  Clock,
  CheckCircle
} from "lucide-react"
import { useLocalStorageData } from "@/hooks/useLocalStorage"
import { localStorageService } from "@/services/localStorageService"
import { useToast } from "@/hooks/use-toast"
import { InventoryAlert } from "@/types"

export default function InventoryAlerts() {
  const { toast } = useToast()
  const { data: alerts, refreshData } = useLocalStorageData<InventoryAlert>(
    'inventoryAlerts',
    () => [], // TODO: Implement inventory alerts in localStorage service
    []
  )

  const [isProcessing, setIsProcessing] = useState(false)

  const getAlertIcon = (type: string) => {
    switch (type) {
      case 'low_stock': return AlertTriangle
      case 'out_of_stock': return Package
      case 'overstock': return Package
      default: return AlertTriangle
    }
  }

  const getAlertColor = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return 'bg-destructive'
      case 'medium': return 'bg-warning'
      case 'low': return 'bg-info'
      default: return 'bg-muted'
    }
  }

  const getSeverityIcon = (severity: string) => {
    switch (severity.toLowerCase()) {
      case 'high': return AlertTriangle
      case 'medium': return Clock
      case 'low': return CheckCircle
      default: return AlertTriangle
    }
  }

  const handleMarkAllRead = () => {
    toast({
      title: "Success",
      description: "All alerts marked as read"
    })
  }

  const handleBulkReorder = async () => {
    setIsProcessing(true)
    
    setTimeout(() => {
      toast({
        title: "Bulk Reorder Initiated",
        description: "Purchase orders created for low stock items"
      })
      setIsProcessing(false)
    }, 2000)
  }

  const handleViewItem = (alert: InventoryAlert) => {
    toast({
      title: "Item Details",
      description: `Viewing details for ${alert.itemName}`
    })
  }

  const handleReorderNow = (alert: InventoryAlert) => {
    toast({
      title: "Reorder Initiated",
      description: `Creating purchase order for ${alert.itemName}`
    })
  }

  const highPriorityCount = alerts.filter(alert => alert.severity === 'High').length
  const mediumPriorityCount = alerts.filter(alert => alert.severity === 'Medium').length
  const lowPriorityCount = alerts.filter(alert => alert.severity === 'Low').length

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Inventory Alerts</h1>
          <p className="text-muted-foreground">
            Monitor inventory levels and resolve stock issues
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleMarkAllRead}>
            Mark All Read
          </Button>
          <Button onClick={handleBulkReorder} disabled={isProcessing}>
            {isProcessing ? "Processing..." : "Bulk Reorder"}
          </Button>
        </div>
      </div>

      {/* Alert Summary */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <AlertTriangle className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold">{highPriorityCount}</div>
                <div className="text-sm text-muted-foreground">High Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <Clock className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{mediumPriorityCount}</div>
                <div className="text-sm text-muted-foreground">Medium Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-info/10 rounded-lg">
                <CheckCircle className="h-5 w-5 text-info" />
              </div>
              <div>
                <div className="text-2xl font-bold">{lowPriorityCount}</div>
                <div className="text-sm text-muted-foreground">Low Priority</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Alerts List */}
      <div className="space-y-4">
        {alerts.map((alert) => {
          const AlertIcon = getAlertIcon(alert.type)
          const SeverityIcon = getSeverityIcon(alert.severity)
          
          return (
            <Card key={alert.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="flex items-start gap-3">
                    <div className={`p-2 rounded-lg ${
                      alert.severity === 'High' ? 'bg-destructive/10' :
                      alert.severity === 'Medium' ? 'bg-warning/10' : 'bg-info/10'
                    }`}>
                      <AlertIcon className={`h-5 w-5 ${
                        alert.severity === 'High' ? 'text-destructive' :
                        alert.severity === 'Medium' ? 'text-warning' : 'text-info'
                      }`} />
                    </div>
                    <div className="space-y-1">
                      <CardTitle className="text-lg">{alert.itemName}</CardTitle>
                      <CardDescription>
                        {alert.warehouseName} • Current Stock: {alert.currentStock}
                        {alert.reorderLevel && ` • Reorder Level: ${alert.reorderLevel}`}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge className={getAlertColor(alert.severity)}>
                    <SeverityIcon className="h-3 w-3 mr-1" />
                    {alert.severity} Priority
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="space-y-1">
                    <div className="text-sm font-medium">
                      {alert.type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} Alert
                    </div>
                    <div className="text-sm text-muted-foreground">
                      Generated recently
                    </div>
                  </div>
                  
                  <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewItem(alert)}>
                      View Item
                    </Button>
                    <Button size="sm" onClick={() => handleReorderNow(alert)}>
                      Reorder Now
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