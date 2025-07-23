import { useState } from "react"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { localStorageService } from "@/services/localStorageService"
import { Invoice } from "@/types"

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
  onSuccess: () => void
}

export default function InvoiceForm({ open, onOpenChange, invoice, onSuccess }: InvoiceFormProps) {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    invoiceNumber: invoice?.invoiceNumber || "",
    supplierId: invoice?.supplierId || "",
    amount: invoice?.amount || 0,
    dueDate: invoice?.dueDate ? invoice.dueDate.toISOString().split('T')[0] : "",
    status: invoice?.status || "Awaiting Payment",
    poNumbers: invoice?.poNumbers?.join(", ") || ""
  })

  const suppliers = localStorageService.getSuppliers()

  const statuses = [
    "Awaiting Payment",
    "Paid",
    "Disputed",
    "Overdue"
  ]

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.invoiceNumber.trim()) {
      toast({
        title: "Validation Error",
        description: "Invoice number is required",
        variant: "destructive"
      })
      return
    }

    if (!formData.supplierId) {
      toast({
        title: "Validation Error",
        description: "Supplier is required",
        variant: "destructive"
      })
      return
    }

    if (formData.amount <= 0) {
      toast({
        title: "Validation Error", 
        description: "Amount must be greater than 0",
        variant: "destructive"
      })
      return
    }

    setIsLoading(true)

    try {
      const poNumbersArray = formData.poNumbers
        .split(",")
        .map(po => po.trim())
        .filter(po => po.length > 0)

      if (invoice) {
        localStorageService.updateInvoice(invoice.id, {
          ...formData,
          dueDate: new Date(formData.dueDate),
          poNumbers: poNumbersArray
        })
        toast({
          title: "Success",
          description: "Invoice updated successfully"
        })
      } else {
        localStorageService.createInvoice({
          ...formData,
          dateIssued: new Date(),
          dueDate: new Date(formData.dueDate),
          poNumbers: poNumbersArray
        })
        toast({
          title: "Success",
          description: "Invoice created successfully"
        })
      }

      setFormData({
        invoiceNumber: "",
        supplierId: "",
        amount: 0,
        dueDate: "",
        status: "Awaiting Payment",
        poNumbers: ""
      })
      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save invoice",
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
          <DialogTitle>{invoice ? "Edit Invoice" : "Upload Invoice"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Update invoice details" : "Add a new supplier invoice"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="invoiceNumber">Invoice Number</Label>
            <Input
              id="invoiceNumber"
              value={formData.invoiceNumber}
              onChange={(e) => setFormData(prev => ({ ...prev, invoiceNumber: e.target.value }))}
              placeholder="INV-2024-001"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="supplierId">Supplier</Label>
            <Select value={formData.supplierId} onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}>
              <SelectTrigger>
                <SelectValue placeholder="Select supplier..." />
              </SelectTrigger>
              <SelectContent>
                {suppliers.map((supplier) => (
                  <SelectItem key={supplier.id} value={supplier.id}>
                    {supplier.supplierName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <Input
              id="amount"
              type="number"
              value={formData.amount}
              onChange={(e) => setFormData(prev => ({ ...prev, amount: parseFloat(e.target.value) || 0 }))}
              placeholder="0.00"
              min="0"
              step="0.01"
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="dueDate">Due Date</Label>
            <Input
              id="dueDate"
              type="date"
              value={formData.dueDate}
              onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status</Label>
            <Select value={formData.status} onValueChange={(value) => setFormData(prev => ({ ...prev, status: value }))}>
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

          <div className="space-y-2">
            <Label htmlFor="poNumbers">Purchase Order Numbers</Label>
            <Input
              id="poNumbers"
              value={formData.poNumbers}
              onChange={(e) => setFormData(prev => ({ ...prev, poNumbers: e.target.value }))}
              placeholder="PO-1001-v1, PO-1002-v1"
            />
            <p className="text-xs text-muted-foreground">Separate multiple PO numbers with commas</p>
          </div>

          <div className="flex gap-3 pt-4">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="flex-1">
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading} className="flex-1">
              {isLoading ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}