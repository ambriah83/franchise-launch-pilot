import { useState, useMemo } from "react"
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
import { useLocalStorageData } from "@/hooks/useLocalStorage"
import { localStorageService } from "@/services/localStorageService"
import { useToast } from "@/hooks/use-toast"
import ShipmentForm from "@/components/forms/ShipmentForm"
import { ShipmentLog } from "@/types"

export default function Receiving() {
  const { toast } = useToast()
  const { data: shipments, refreshData } = useLocalStorageData<ShipmentLog>(
    'shipmentLogs',
    () => [], // TODO: Implement shipment logs in localStorage service
    []
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)

  const filteredShipments = useMemo(() => {
    if (!searchTerm) return shipments
    
    return shipments.filter(shipment =>
      shipment.shipmentId.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.poNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.carrier.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.trackingNumber?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [shipments, searchTerm])

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

  const handleLogShipment = () => {
    setFormOpen(true)
  }

  const handleViewDetails = (shipment: ShipmentLog) => {
    toast({
      title: "Shipment Details",
      description: `Viewing details for ${shipment.shipmentId}`
    })
  }

  const handleProcessItems = (shipment: ShipmentLog) => {
    toast({
      title: "Processing Items",
      description: `Processing items for ${shipment.shipmentId}`
    })
  }

  const handleFormSuccess = () => {
    refreshData()
  }

  const totalShipments = shipments.length
  const completedShipments = shipments.filter(s => s.status === 'Completed').length
  const partialShipments = shipments.filter(s => s.status === 'Partial').length
  const issueShipments = shipments.filter(s => s.status === 'Issues').length

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
        <Button onClick={handleLogShipment}>
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
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Receiving Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <Truck className="h-5 w-5 text-primary" />
              <div>
                <div className="text-2xl font-bold">{totalShipments}</div>
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
                <div className="text-2xl font-bold">{completedShipments}</div>
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
                <div className="text-2xl font-bold">{partialShipments}</div>
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
                <div className="text-2xl font-bold">{issueShipments}</div>
                <div className="text-sm text-muted-foreground">Issues</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Shipments List */}
      <div className="space-y-4">
        {filteredShipments.map((shipment) => {
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
                      <div>Total: {shipment.lineItems?.length || 0}</div>
                      <div>Received: {shipment.lineItems?.length || 0}</div>
                      <div>Damaged: 0</div>
                    </div>
                  </div>
                  
                  {/* Progress */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Completion</div>
                    <div className="text-2xl font-bold">
                      {shipment.lineItems?.length ? 100 : 0}%
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewDetails(shipment)}>
                      View Details
                    </Button>
                    <Button size="sm" onClick={() => handleProcessItems(shipment)}>
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