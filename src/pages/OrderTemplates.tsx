import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { 
  Package,
  Search,
  Plus,
  Copy,
  Edit,
  Trash2
} from "lucide-react"

const mockTemplates = [
  {
    id: 1,
    name: "Standard FF&E Package",
    description: "Complete furniture, fixtures, and equipment package for standard franchise location",
    itemCount: 45,
    estimatedCost: 125000,
    category: "Complete Setup"
  },
  {
    id: 2,
    name: "Kitchen Equipment Basic",
    description: "Essential kitchen equipment and appliances",
    itemCount: 18,
    estimatedCost: 85000,
    category: "Kitchen"
  },
  {
    id: 3,
    name: "Dining Room Furniture",
    description: "Tables, chairs, and dining area fixtures",
    itemCount: 12,
    estimatedCost: 25000,
    category: "Furniture"
  },
  {
    id: 4,
    name: "POS & Technology Setup",
    description: "Point of sale systems, tablets, and technology infrastructure",
    itemCount: 8,
    estimatedCost: 15000,
    category: "Technology"
  }
]

export default function OrderTemplates() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'Complete Setup': return 'bg-primary'
      case 'Kitchen': return 'bg-warning'
      case 'Furniture': return 'bg-info'
      case 'Technology': return 'bg-success'
      default: return 'bg-muted'
    }
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Order Templates</h1>
          <p className="text-muted-foreground">
            Pre-configured order templates for quick franchise setup
          </p>
        </div>
        <Button>
          <Plus className="h-4 w-4 mr-2" />
          Create Template
        </Button>
      </div>

      {/* Search */}
      <div className="relative max-w-sm">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Search templates..."
          className="pl-10"
        />
      </div>

      {/* Templates Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockTemplates.map((template) => (
          <Card key={template.id} className="hover:shadow-md transition-shadow">
            <CardHeader>
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <CardTitle className="text-lg">{template.name}</CardTitle>
                  <CardDescription>{template.description}</CardDescription>
                </div>
                <Package className="h-5 w-5 text-muted-foreground" />
              </div>
              <Badge className={getCategoryColor(template.category)}>
                {template.category}
              </Badge>
            </CardHeader>
            
            <CardContent className="space-y-4">
              {/* Template Stats */}
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Items:</span>
                  <div className="font-medium">{template.itemCount} items</div>
                </div>
                <div>
                  <span className="text-muted-foreground">Est. Cost:</span>
                  <div className="font-medium">{formatCurrency(template.estimatedCost)}</div>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1">
                  <Copy className="h-3 w-3 mr-1" />
                  Use Template
                </Button>
                <Button variant="outline" size="sm">
                  <Edit className="h-3 w-3" />
                </Button>
                <Button variant="outline" size="sm">
                  <Trash2 className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}