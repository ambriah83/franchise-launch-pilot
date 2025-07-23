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
import { Invoice, InvoiceStatus } from "@/types"
import { invoiceSchema } from "@/schemas/validationSchemas"
import { useEffect, useState } from "react"

interface InvoiceFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  invoice?: Invoice
  onSuccess: () => void
}

export default function InvoiceForm({ open, onOpenChange, invoice, onSuccess }: InvoiceFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(invoiceSchema),
    defaultValues: {
      invoiceNumber: invoice?.invoiceNumber || "",
      supplierId: invoice?.supplierId || "",
      amount: invoice?.amount || 0,
      dueDate: invoice?.dueDate ? invoice.dueDate.toISOString().split('T')[0] : "",
      status: invoice?.status || "Awaiting Payment",
      poNumbers: invoice?.poNumbers?.join(", ") || ""
    }
  })

  // Reset form when invoice changes
  useEffect(() => {
    if (invoice) {
      form.reset({
        invoiceNumber: invoice.invoiceNumber,
        supplierId: invoice.supplierId,
        amount: invoice.amount,
        dueDate: invoice.dueDate.toISOString().split('T')[0],
        status: invoice.status,
        poNumbers: invoice.poNumbers?.join(", ") || ""
      })
    } else {
      form.reset({
        invoiceNumber: "",
        supplierId: "",
        amount: 0,
        dueDate: "",
        status: "Awaiting Payment",
        poNumbers: ""
      })
    }
  }, [invoice, form])

  const suppliers = localStorageService.getSuppliers()

  const statuses = [
    "Awaiting Payment",
    "Paid",
    "Disputed",
    "Overdue"
  ]

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const poNumbersArray = data.poNumbers
        .split(",")
        .map((po: string) => po.trim())
        .filter((po: string) => po.length > 0)

      if (invoice) {
        localStorageService.updateInvoice(invoice.id, {
          ...data,
          dueDate: new Date(data.dueDate),
          poNumbers: poNumbersArray
        })
        toast({
          title: "Invoice Updated",
          description: `Invoice ${data.invoiceNumber} has been updated successfully.`
        })
      } else {
        localStorageService.createInvoice({
          ...data,
          dateIssued: new Date(),
          dueDate: new Date(data.dueDate),
          poNumbers: poNumbersArray
        })
        toast({
          title: "Invoice Created",
          description: `Invoice ${data.invoiceNumber} has been created successfully.`
        })
      }

      onOpenChange(false)
      onSuccess()
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save invoice. Please try again.",
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
          <DialogTitle>{invoice ? "Edit Invoice" : "Upload Invoice"}</DialogTitle>
          <DialogDescription>
            {invoice ? "Update invoice details" : "Add a new supplier invoice"}
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="invoiceNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Invoice Number *</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="INV-2024-001"
                      {...field}
                      className={form.formState.errors.invoiceNumber ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="supplierId"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Supplier *</FormLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <FormControl>
                      <SelectTrigger className={form.formState.errors.supplierId ? "border-destructive" : ""}>
                        <SelectValue placeholder="Select supplier..." />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {suppliers.map((supplier) => (
                        <SelectItem key={supplier.id} value={supplier.id}>
                          {supplier.supplierName}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount *</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="0.00"
                      min="0"
                      step="0.01"
                      {...field}
                      onChange={(e) => field.onChange(parseFloat(e.target.value) || 0)}
                      className={form.formState.errors.amount ? "border-destructive" : ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Invoice amount in USD
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date *</FormLabel>
                  <FormControl>
                    <Input
                      type="date"
                      {...field}
                      className={form.formState.errors.dueDate ? "border-destructive" : ""}
                    />
                  </FormControl>
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

            <FormField
              control={form.control}
              name="poNumbers"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Purchase Order Numbers</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="PO-1001-v1, PO-1002-v1"
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Separate multiple PO numbers with commas
                  </FormDescription>
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
                {isSubmitting ? "Saving..." : invoice ? "Update Invoice" : "Create Invoice"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}