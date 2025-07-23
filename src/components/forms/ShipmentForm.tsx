import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { useToast } from "@/hooks/use-toast"
import { localStorageService } from "@/services/localStorageService"
import { ShipmentLog } from "@/types"
import { shipmentLogSchema } from "@/schemas/validationSchemas"
import { useEffect, useState } from "react"

interface ShipmentFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  shipment?: ShipmentLog
  onSuccess: () => void
}

export default function ShipmentForm({ open, onOpenChange, shipment, onSuccess }: ShipmentFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(shipmentLogSchema),
    defaultValues: {
      shipmentId: shipment?.shipmentId || "",
      poNumber: shipment?.poNumber || "",
      carrier: shipment?.carrier || "",
      trackingNumber: shipment?.trackingNumber || "",
      receivedBy: shipment?.receivedBy || "",
      status: shipment?.status || "Completed"
    }
  })

  // Reset form when shipment changes
  useEffect(() => {
    if (shipment) {
      form.reset({
        shipmentId: shipment.shipmentId,
        poNumber: shipment.poNumber,
        carrier: shipment.carrier,
        trackingNumber: shipment.trackingNumber,
        receivedBy: shipment.receivedBy,
        status: shipment.status
      })
    } else {
      form.reset({
        shipmentId: "",
        poNumber: "",
        carrier: "",
        trackingNumber: "",
        receivedBy: "",
        status: "Completed"
      })
    }
  }, [shipment, form])

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

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      if (shipment) {
        localStorageService.updateShipmentLog(shipment.id, {
          ...data,
          dateReceived: shipment.dateReceived
        })
        toast({
          title: "Shipment Updated",
          description: `Shipment ${data.shipmentId} has been updated successfully.`
        })
      } else {
        localStorageService.createShipmentLog({
          ...data,
          poId: data.poNumber, // Use poNumber as poId for now
          receivedById: data.receivedBy, // Map receivedBy to receivedById
          dateReceived: new Date(),
          lineItems: []
        })
        toast({
          title: "Shipment Logged",
          description: `Shipment ${data.shipmentId} has been logged successfully.`
        })
      }

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save shipment. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>{shipment ? "Edit Shipment" : "Log Shipment"}</DialogTitle>
          <DialogDescription>
            {shipment ? "Update shipment details" : "Log a new incoming shipment"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="shipmentId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Shipment ID *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="SHP-2024-001"
                      {...field}
                      className={form.formState.errors.shipmentId ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="poNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PO-1001-v1"
                      {...field}
                      className={form.formState.errors.poNumber ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="carrier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Carrier</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select carrier..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {carriers.map((carrier) => (
                        <SelectItem key={carrier} value={carrier}>
                          {carrier}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormDescription>
                    Select the shipping carrier
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="trackingNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tracking Number</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter tracking number..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional tracking number for this shipment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="receivedBy"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Received By</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Enter receiver name..."
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Name of the person who received this shipment
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {statuses.map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex gap-3 pt-4">
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)} 
                className="flex-1"
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting} 
                className="flex-1"
              >
                {isSubmitting ? "Saving..." : shipment ? "Update Shipment" : "Log Shipment"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}