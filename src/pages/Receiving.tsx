import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Truck,
  Search,
  Plus,
  Calendar,
  Package,
  CheckCircle,
  AlertTriangle
} from "lucide-react"

const mockShipments = [
  {
    id: 1,
    shipmentId: "SHP-2024-001",
    poNumber: "PO-1001-v1",
    carrier: "FedEx Freight",
    trackingNumber: "8901234567890",
    dateReceived: new Date("2024-01-15"),
    receivedBy: "John Smith",
    status: "Completed",
    totalItems: 12,
    itemsReceived: 12,
    itemsDamaged: 0
  },
  {
    id: 2,
    shipmentId: "SHP-2024-002",
    poNumber: "PO-1002-v1",
    carrier: "UPS Freight",
    trackingNumber: "1Z9999999999999999",
    dateReceived: new Date("2024-01-14"),
    receivedBy: "Sarah Johnson",
    status: "Partial",
    totalItems: 8,
    itemsReceived: 6,
    itemsDamaged: 1
  },
  {
    id: 3,
    shipmentId: "SHP-2024-003",
    poNumber: "PO-1003-v1",
    carrier: "DHL Supply Chain",
    trackingNumber: "JD014600006796814059",
    dateReceived: new Date("2024-01-13"),
    receivedBy: "Mike Chen",
    status: "Issues",
    totalItems: 15,
    itemsReceived: 13,
    itemsDamaged: 3
  }
]

export default function Receiving() {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success'
      case 'partial': return 'bg-warning'
      case 'issues': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return CheckCircle
      case 'partial': return Package
      case 'issues': return AlertTriangle
      default: return Package
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Receiving</h1>
          <p className="text-muted-foreground">
            Track and manage incoming shipments and deliveries
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Log Shipment
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search shipments..."
          className="pl-10"
        />
      </div>

      {/* Receiving Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">25</div>
                <div className="text-sm text-muted-foreground">Total Shipments</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-5 w-5 text-success" />
              <div>
                <div className="text-2xl font-bold">18</div>
                <div className="text-sm text-muted-foreground">Completed</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Package className="h-5 w-5 text-warning" />
              <div>
                <div className="text-2xl font-bold">5</div>
                <div className="text-sm text-muted-foreground">Partial</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <AlertTriangle className="h-5 w-5 text-destructive" />
              <div>
                <div className="text-2xl font-bold">2</div>
                <div className="text-sm text-muted-foreground">Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {mockShipments.map((shipment) => {
          const StatusIcon = getStatusIcon(shipment.status)
          
          return (
            <Card key={shipment.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{shipment.shipmentId}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>PO: {shipment.poNumber}</span>
                      <span>Carrier: {shipment.carrier}</span>
                      <span>Tracking: {shipment.trackingNumber}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(shipment.status)}>
                    <StatusIcon className="h-3 w-3 mr-1" />
                    {shipment.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Received Info */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Received</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        {shipment.dateReceived.toLocaleDateString()}
                      </div>
                      <div>By: {shipment.receivedBy}</div>
                    </div>
                  </div>
                  
                  {/* Items Status */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Items</div>
                    <div className="space-y-1 text-sm">
                      <div>Total: {shipment.totalItems}</div>
                      <div>Received: {shipment.itemsReceived}</div>
                      <div>Damaged: {shipment.itemsDamaged}</div>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Completion</div>
                    <div className="text-2xl font-bold">
                      {Math.round((shipment.itemsReceived / shipment.totalItems) * 100)}%
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm">
                      View Details
                    </Button>
                    <Button size="sm">
                      Process Items
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