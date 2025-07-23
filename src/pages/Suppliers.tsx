import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { 
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock,
  Building2,
  User,
  Calendar,
  Edit,
  Eye
} from "lucide-react"
import { mockSuppliers } from "@/data/mockData"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"

export default function Suppliers() {
  const { toast } = useToast()
  const [suppliers, setSuppliers] = useState(mockSuppliers)
  const [searchTerm, setSearchTerm] = useState('')
  const [viewSupplier, setViewSupplier] = useState(null)
  const [editSupplier, setEditSupplier] = useState(null)
  const [showAddDialog, setShowAddDialog] = useState(false)
  const [formData, setFormData] = useState({
    supplierName: '',
    contactPerson: '',
    email: '',
    phone: '',
    address: '',
    avgLeadTimeDays: 14
  })

  const getLeadTimeColor = (days: number) => {
    if (days <= 7) return 'bg-success'
    if (days <= 14) return 'bg-warning'
    return 'bg-destructive'
  }

  const handleViewSupplier = (supplier) => {
    setViewSupplier(supplier)
  }

  const handleEditSupplier = (supplier) => {
    setEditSupplier(supplier)
    setFormData({
      supplierName: supplier.supplierName,
      contactPerson: supplier.contactPerson,
      email: supplier.email,
      phone: supplier.phone,
      address: supplier.address,
      avgLeadTimeDays: supplier.avgLeadTimeDays
    })
  }

  const handleAddSupplier = () => {
    setShowAddDialog(true)
    setFormData({
      supplierName: '',
      contactPerson: '',
      email: '',
      phone: '',
      address: '',
      avgLeadTimeDays: 14
    })
  }

  const handleSaveSupplier = () => {
    if (!formData.supplierName || !formData.email || !formData.contactPerson) {
      toast({
        title: "Validation Error",
        description: "Please fill in all required fields.",
        variant: "destructive"
      })
      return
    }

    if (editSupplier) {
      setSuppliers(prev => prev.map(supplier => 
        supplier.id === editSupplier.id 
          ? { ...supplier, ...formData }
          : supplier
      ))
      toast({
        title: "Supplier Updated",
        description: `${formData.supplierName} has been updated successfully.`
      })
      setEditSupplier(null)
    } else {
      const newSupplier = {
        id: `SUP-${Date.now()}`,
        ...formData,
        createdAt: new Date(),
        updatedAt: new Date()
      }
      setSuppliers(prev => [...prev, newSupplier])
      toast({
        title: "Supplier Added",
        description: `${formData.supplierName} has been added successfully.`
      })
      setShowAddDialog(false)
    }
  }

  const handleFormChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Suppliers</h1>
          <p className="text-muted-foreground">
            Manage supplier relationships and contact information
          </p>
        </div>
        <Button onClick={handleAddSupplier}>
          <Plus className="h-4 w-4 mr-2" />
          Add Supplier
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search suppliers..."
          className="pl-10"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {suppliers
          .filter(supplier => 
            supplier.supplierName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.contactPerson.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
            supplier.address.toLowerCase().includes(searchTerm.toLowerCase())
          )
          .map((supplier) => (
          <Card key={supplier.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{supplier.supplierName}</CardTitle>
                  <CardDescription>
                    Primary supplier for franchise equipment
                  </CardDescription>
                </div>
                <Users className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge className={getLeadTimeColor(supplier.avgLeadTimeDays)}>
                <Clock className="h-3 w-3 mr-1" />
                {supplier.avgLeadTimeDays} day lead time
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Contact Information */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.email}</span>
                </div>
                
                <div className="flex items-center gap-2 text-sm">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <span>{supplier.phone}</span>
                </div>
                
                <div className="flex items-start gap-2 text-sm">
                  <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                  <span className="line-clamp-2">{supplier.address}</span>
                </div>
              </div>
              
              {/* Contact Person */}
              <div className="p-3 bg-muted/50 rounded-lg">
                <div className="text-sm font-medium">Primary Contact</div>
                <div className="text-sm text-muted-foreground">{supplier.contactPerson}</div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleViewSupplier(supplier)}>
                  <Eye className="h-4 w-4 mr-1" />
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1" onClick={() => handleEditSupplier(supplier)}>
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* View Supplier Dialog */}
      <Dialog open={!!viewSupplier} onOpenChange={() => setViewSupplier(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5" />
              {viewSupplier?.supplierName}
            </DialogTitle>
            <DialogDescription>
              Complete supplier information and performance metrics
            </DialogDescription>
          </DialogHeader>
          
          {viewSupplier && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Contact Person</Label>
                    <div className="flex items-center gap-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span>{viewSupplier.contactPerson}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Email</Label>
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4 text-muted-foreground" />
                      <span>{viewSupplier.email}</span>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Phone</Label>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-muted-foreground" />
                      <span>{viewSupplier.phone}</span>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Lead Time</Label>
                    <div className="flex items-center gap-2">
                      <Clock className="h-4 w-4 text-muted-foreground" />
                      <Badge className={getLeadTimeColor(viewSupplier.avgLeadTimeDays)}>
                        {viewSupplier.avgLeadTimeDays} days
                      </Badge>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <Label className="text-sm font-medium text-muted-foreground">Address</Label>
                    <div className="flex items-start gap-2">
                      <MapPin className="h-4 w-4 text-muted-foreground mt-0.5" />
                      <span className="text-sm">{viewSupplier.address}</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Performance Metrics</h4>
                <div className="grid grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-success">98%</div>
                    <div className="text-sm text-muted-foreground">On-time Delivery</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-info">4.8</div>
                    <div className="text-sm text-muted-foreground">Quality Score</div>
                  </div>
                  <div className="text-center p-3 bg-muted/50 rounded-lg">
                    <div className="text-2xl font-bold text-warning">24</div>
                    <div className="text-sm text-muted-foreground">Active Orders</div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Edit/Add Supplier Dialog */}
      <Dialog open={!!editSupplier || showAddDialog} onOpenChange={() => {
        setEditSupplier(null)
        setShowAddDialog(false)
      }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editSupplier ? 'Edit Supplier' : 'Add New Supplier'}
            </DialogTitle>
            <DialogDescription>
              {editSupplier ? 'Update supplier information' : 'Create a new supplier entry'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="supplierName">Supplier Name *</Label>
              <Input
                id="supplierName"
                value={formData.supplierName}
                onChange={(e) => handleFormChange('supplierName', e.target.value)}
                placeholder="Enter supplier name"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="contactPerson">Contact Person *</Label>
              <Input
                id="contactPerson"
                value={formData.contactPerson}
                onChange={(e) => handleFormChange('contactPerson', e.target.value)}
                placeholder="Enter contact person"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) => handleFormChange('email', e.target.value)}
                placeholder="Enter email address"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="phone">Phone</Label>
              <Input
                id="phone"
                value={formData.phone}
                onChange={(e) => handleFormChange('phone', e.target.value)}
                placeholder="Enter phone number"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="leadTime">Lead Time (days)</Label>
              <Input
                id="leadTime"
                type="number"
                min="1"
                max="365"
                value={formData.avgLeadTimeDays}
                onChange={(e) => handleFormChange('avgLeadTimeDays', parseInt(e.target.value))}
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="address">Address</Label>
            <Textarea
              id="address"
              value={formData.address}
              onChange={(e) => handleFormChange('address', e.target.value)}
              placeholder="Enter complete address"
              rows={3}
            />
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setEditSupplier(null)
              setShowAddDialog(false)
            }}>
              Cancel
            </Button>
            <Button onClick={handleSaveSupplier}>
              {editSupplier ? 'Update Supplier' : 'Add Supplier'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}