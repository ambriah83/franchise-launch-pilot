import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Search,
  Filter,
  Plus,
  Edit,
  Package
} from "lucide-react"

const mockCatalogItems = [
  {
    id: 1,
    sku: "CHAIR-001",
    itemName: "Dining Chair - Standard",
    description: "Comfortable dining chair with back support, commercial grade",
    category: "Furniture",
    supplier: "Commercial Furniture Co.",
    defaultPrice: 85,
    status: "Active",
    image: null
  },
  {
    id: 2,
    sku: "GRILL-PRO-500",
    itemName: "Commercial Grill Pro 500",
    description: "Heavy-duty commercial grill, stainless steel, 500°F max",
    category: "Kitchen Equipment",
    supplier: "Kitchen Solutions LLC",
    defaultPrice: 4500,
    status: "Active",
    image: null
  },
  {
    id: 3,
    sku: "TABLE-ROUND-48",
    itemName: "Round Table 48 inch",
    description: "Round dining table, 48 inch diameter, seats 4 people",
    category: "Furniture",
    supplier: "Commercial Furniture Co.",
    defaultPrice: 320,
    status: "Active",
    image: null
  },
  {
    id: 4,
    sku: "MIXER-STAND-20QT",
    itemName: "Stand Mixer 20 Quart",
    description: "Commercial stand mixer, 20 quart capacity, variable speed",
    category: "Kitchen Equipment",
    supplier: "Kitchen Solutions LLC",
    defaultPrice: 2800,
    status: "Discontinued",
    image: null
  }
]

export default function InventoryCatalog() {
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
      case 'active': return 'bg-success'
      case 'discontinued': return 'bg-destructive'
      default: return 'bg-muted'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Kitchen Equipment': return 'bg-warning'
      case 'Furniture': return 'bg-info'
      case 'Technology': return 'bg-primary'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Item Catalog</h1>
          <p className="text-muted-foreground">
            Master catalog of all available franchise items
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>

      {/* Filters */}
      <div className="flex gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search catalog..."
            className="pl-10"
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockCatalogItems.map((item) => (
          <Card key={item.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{item.itemName}</CardTitle>
                  <CardDescription className="line-clamp-2">{item.description}</CardDescription>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <div className="flex gap-2">
                <Badge className={getCategoryColor(item.category)}>
                  {item.category}
                </Badge>
                <Badge className={getStatusColor(item.status)}>
                  {item.status}
                </Badge>
              </div>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Item Details */}
              <div className="space-y-2 text-sm">
                <div>
                  <span className="text-muted-foreground">SKU:</span>
                  <span className="ml-2 font-medium">{item.sku}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Supplier:</span>
                  <span className="ml-2">{item.supplier}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Default Price:</span>
                  <span className="ml-2 font-medium">{formatCurrency(item.defaultPrice)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  View Details
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}