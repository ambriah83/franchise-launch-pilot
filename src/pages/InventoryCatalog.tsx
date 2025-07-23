import { useState, useMemo } from "react"
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
import { useLocalStorageData } from "@/hooks/useLocalStorage"
import { localStorageService } from "@/services/localStorageService"
import { useToast } from "@/hooks/use-toast"
import { CatalogItemForm } from "@/components/forms/CatalogItemForm"
import { CatalogItem } from "@/types"

export default function InventoryCatalog() {
  const { toast } = useToast()
  const { data: catalogItems, refreshData } = useLocalStorageData<CatalogItem>(
    'catalogItems',
    () => localStorageService.getCatalogItems(),
    []
  )

  const [searchTerm, setSearchTerm] = useState("")
  const [formOpen, setFormOpen] = useState(false)
  const [editingItem, setEditingItem] = useState<CatalogItem | undefined>()

  const filteredItems = useMemo(() => {
    if (!searchTerm) return catalogItems
    
    return catalogItems.filter(item =>
      item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      localStorageService.getSuppliers().find(s => s.id === item.supplierId)?.supplierName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
  }, [catalogItems, searchTerm])

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

  const handleCreateItem = () => {
    setEditingItem(undefined)
    setFormOpen(true)
  }

  const handleEditItem = (item: CatalogItem) => {
    setEditingItem(item)
    setFormOpen(true)
  }

  const handleFormSuccess = () => {
    refreshData()
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
        <Button onClick={handleCreateItem}>
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
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <Button variant="outline">
          <Filter className="h-4 w-4 mr-2" />
          Filter
        </Button>
      </div>

      {/* Catalog Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredItems.map((item) => (
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
                  <span className="ml-2">{localStorageService.getSuppliers().find(s => s.id === item.supplierId)?.supplierName || "N/A"}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Default Price:</span>
                  <span className="ml-2 font-medium">{formatCurrency(item.defaultUnitPrice)}</span>
                </div>
              </div>
              
              {/* Actions */}
              <div className="flex gap-2">
                <Button size="sm" className="flex-1" onClick={() => handleEditItem(item)}>
                  View Details
                </Button>
                <Button variant="outline" size="sm" onClick={() => handleEditItem(item)}>
                  <Edit className="h-3 w-3" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <CatalogItemForm
        open={formOpen}
        onOpenChange={setFormOpen}
        item={editingItem}
        onSuccess={handleFormSuccess}
      />
    </div>
  )
}