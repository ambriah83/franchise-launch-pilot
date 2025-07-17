import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Users,
  Search,
  Plus,
  Phone,
  Mail,
  MapPin,
  Clock
} from "lucide-react"
import { mockSuppliers } from "@/data/mockData"

export default function Suppliers() {
  const getLeadTimeColor = (days: number) => {
    if (days <= 7) return 'bg-success'
    if (days <= 14) return 'bg-warning'
    return 'bg-destructive'
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
        <Button>
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
        />
      </div>

      {/* Suppliers Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockSuppliers.map((supplier) => (
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
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm" className="flex-1">
                  Edit
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}