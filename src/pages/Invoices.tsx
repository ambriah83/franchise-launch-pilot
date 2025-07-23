import { useState, useMemo } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  FileText,
  Search,
  Filter,
  Calendar,
  DollarSign,
  Download
} from "lucide-react"
import { useLocalStorageData } from "@/hooks/useLocalStorage"
import { localStorageService } from "@/services/localStorageService"
import { useToast } from "@/hooks/use-toast"
import InvoiceForm from "@/components/forms/InvoiceForm"
import { Invoice } from "@/types"

export default function Invoices() {
  const { toast } = useToast()
  const { data: invoices, refreshData } = useLocalStorageData<Invoice>(
    'invoices',
    () => [], // TODO: Implement invoices in localStorage service
    []
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)

  const filteredInvoices = useMemo(() => {
    if (!searchTerm) return invoices
    
    return invoices.filter(invoice =>
      invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      invoice.poNumbers.some(po => po.toLowerCase().includes(searchTerm.toLowerCase()))
    )
  }, [invoices, searchTerm])

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
      case 'paid': return 'bg-success'
      case 'awaiting payment': return 'bg-warning'
      case 'disputed': return 'bg-destructive'
      case 'overdue': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const getDaysUntilDue = (dueDate: Date) => {
    const today = new Date()
    const diffTime = dueDate.getTime() - today.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const totalPending = invoices
    .filter(inv => inv.status === 'Awaiting Payment')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const totalPaid = invoices
    .filter(inv => inv.status === 'Paid')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const totalDisputed = invoices
    .filter(inv => inv.status === 'Disputed')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const handleUploadInvoice = () => {
    setFormOpen(true)
  }

  const handleExport = () => {
    toast({
      title: "Exporting Data",
      description: "Invoice data is being prepared for download"
    })
  }

  const handleViewPDF = (invoice: Invoice) => {
    toast({
      title: "Opening PDF",
      description: `Opening PDF for ${invoice.invoiceNumber}`
    })
  }

  const handleProcessPayment = (invoice: Invoice) => {
    localStorageService.updateInvoice(invoice.id, { status: 'Paid' })
    toast({
      title: "Payment Processed",
      description: `Payment completed for ${invoice.invoiceNumber}`
    })
    refreshData()
  }

  const handleResolveDispute = (invoice: Invoice) => {
    localStorageService.updateInvoice(invoice.id, { status: 'Awaiting Payment' })
    toast({
      title: "Dispute Resolved",
      description: `Dispute resolved for ${invoice.invoiceNumber}`
    })
    refreshData()
  }

  const handleFormSuccess = () => {
    refreshData()
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Invoices</h1>
          <p className="text-muted-foreground">
            Track and manage supplier invoices and payments
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExport}>
            <Download className="h-4 w-4 mr-2" />
            Export
          </Button>
          <Button onClick={handleUploadInvoice}>
            Upload Invoice
          </Button>
        </div>
      </div>

      {/* Invoice Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-primary/10 rounded-lg">
                <FileText className="h-5 w-5 text-primary" />
              </div>
              <div>
                <div className="text-2xl font-bold">{invoices.length}</div>
                <div className="text-sm text-muted-foreground">Total Invoices</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-warning/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-warning" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalPending)}</div>
                <div className="text-sm text-muted-foreground">Pending Payment</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-success/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-success" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalPaid)}</div>
                <div className="text-sm text-muted-foreground">Paid</div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-destructive/10 rounded-lg">
                <DollarSign className="h-5 w-5 text-destructive" />
              </div>
              <div>
                <div className="text-2xl font-bold">{formatCurrency(totalDisputed)}</div>
                <div className="text-sm text-muted-foreground">Disputed</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search invoices..."
            className="pl-10"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Invoices List */}
      <div className="space-y-4">
        {filteredInvoices.map((invoice) => {
          const daysUntilDue = getDaysUntilDue(invoice.dueDate)
          
          return (
            <Card key={invoice.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{invoice.invoiceNumber}</CardTitle>
                    <CardDescription className="flex items-center gap-4">
                      <span>Supplier: {localStorageService.getSuppliers().find(s => s.id === invoice.supplierId)?.supplierName || "Unknown"}</span>
                      <span>PO(s): {invoice.poNumbers.join(", ")}</span>
                    </CardDescription>
                  </div>
                  <Badge className={getStatusColor(invoice.status)}>
                    {invoice.status}
                  </Badge>
                </div>
              </CardHeader>
              
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  {/* Dates */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Dates</div>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        Issued: {invoice.dateIssued.toLocaleDateString()}
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="h-3 w-3 text-muted-foreground" />
                        Due: {invoice.dueDate.toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  {/* Amount */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Amount</div>
                    <div className="text-2xl font-bold">{formatCurrency(invoice.amount)}</div>
                  </div>
                  
                  {/* Status Info */}
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Status</div>
                    <div className="text-sm">
                      {invoice.status === 'Awaiting Payment' && (
                        <span className={daysUntilDue < 0 ? 'text-destructive' : daysUntilDue <= 7 ? 'text-warning' : 'text-muted-foreground'}>
                          {daysUntilDue < 0 ? `${Math.abs(daysUntilDue)} days overdue` : 
                           daysUntilDue === 0 ? 'Due today' :
                           `${daysUntilDue} days until due`}
                        </span>
                      )}
                      {invoice.status === 'Paid' && (
                        <span className="text-success">Payment completed</span>
                      )}
                      {invoice.status === 'Disputed' && (
                        <span className="text-destructive">Requires attention</span>
                      )}
                    </div>
                  </div>
                  
                  {/* Actions */}
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => handleViewPDF(invoice)}>
                      View PDF
                    </Button>
                    {invoice.status === 'Awaiting Payment' && (
                      <Button size="sm" onClick={() => handleProcessPayment(invoice)}>
                        Process Payment
                      </Button>
                    )}
                    {invoice.status === 'Disputed' && (
                      <Button size="sm" variant="destructive" onClick={() => handleResolveDispute(invoice)}>
                        Resolve Dispute
                      </Button>
                    )}
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