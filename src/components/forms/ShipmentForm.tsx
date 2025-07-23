import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { localStorageService } from "@/services/localStorageService"
import { ShipmentLog } from "@/types"

interface ShipmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipment?: ShipmentLog
  onSuccess: () => void
}

export default function ShipmentForm({ open, onOpenChange, shipment, onSuccess }: ShipmentFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    shipmentId: shipment?.shipmentId || "",
    poNumber: shipment?.poNumber || "",
    carrier: shipment?.carrier || "",
    trackingNumber: shipment?.trackingNumber || "",
    receivedBy: shipment?.receivedBy || "",
    status: shipment?.status || "Completed"
  })

  const carriers = [
    "FedEx Freight",
    "UPS Freight", 
    "DHL Supply Chain",
    "USPS",
    "Other"
  ]

  const statuses = [
    "Completed",
    "Partial", 
    "Issues"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.shipmentId.trim()) {
      toast({
        title: "Validation Error",
        description: "Shipment ID is required",
        variant: "destructive"
      })
      return
    }

    if (!formData.poNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Purchase Order number is required", 
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      if (shipment) {
        localStorageService.updateShipmentLog(shipment.id, {
          ...formData,
          dateReceived: shipment.dateReceived
        })
        toast({
          title: "Success",
          description: "Shipment updated successfully"
        })
      } else {
        localStorageService.createShipmentLog({
          ...formData,
          poId: formData.poNumber, // Use poNumber as poId for now
          receivedById: formData.receivedBy, // Map receivedBy to receivedById
          dateReceived: new Date(),
          lineItems: []
        })
        toast({
          title: "Success",
          description: "Shipment logged successfully"
        })
      }

      setFormData({
        shipmentId: "",
        poNumber: "",
        carrier: "",
        trackingNumber: "",
        receivedBy: "",
        status: "Completed"
      })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shipment",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{shipment ? "Edit Shipment" : "Log Shipment"}</DialogTitle>
          <DialogDescription>
            {shipment ? "Update shipment details" : "Log a new incoming shipment"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="shipmentId">Shipment ID</Label>
            <Input
              id="shipmentId"
              value={formData.shipmentId}
              onChange={(e) => setFormData(prev => ({ ...prev, shipmentId: e.target.value }))}
              placeholder="SHP-2024-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="poNumber">Purchase Order Number</Label>
            <Input
              id="poNumber"
              value={formData.poNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, poNumber: e.target.value }))}
              placeholder="PO-1001-v1"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="carrier">Carrier</Label>
            <Select value={formData.carrier} onValueChange={(value) => setFormData(prev => ({ ...prev, carrier: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select carrier..." />
              </SelectTrigger>
              <SelectContent>
                {carriers.map((carrier) => (
                  <SelectItem key={carrier} value={carrier}>
                    {carrier}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="trackingNumber">Tracking Number</Label>
            <Input
              id="trackingNumber"
              value={formData.trackingNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, trackingNumber: e.target.value }))}
              placeholder="Enter tracking number..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="receivedBy">Received By</Label>
            <Input
              id="receivedBy"
              value={formData.receivedBy}
              onChange={(e) => setFormData(prev => ({ ...prev, receivedBy: e.target.value }))}
              placeholder="Enter receiver name..."
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value: 'Pending' | 'In Transit' | 'Delivered' | 'Delayed' | 'Completed' | 'Partial' | 'Issues') => setFormData(prev => ({ ...prev, status: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select status..." />
              </SelectTrigger>
              <SelectContent>
                {statuses.map((status) => (
                  <SelectItem key={status} value={status}>
                    {status}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : shipment ? "Update Shipment" : "Log Shipment"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}