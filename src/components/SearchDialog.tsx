import { useState, useMemo } from 'react';
import { Search, Command } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useNavigate } from 'react-router-dom';
import { localStorageService } from '../services/localStorageService';

interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'project' | 'purchase-order' | 'catalog-item' | 'supplier' | 'warehouse';
  url: string;
}

export function SearchDialog() {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const navigate = useNavigate();

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Search projects
    const projects = localStorageService.getProjects();
    projects.forEach(project => {
      if (
        project.locationName.toLowerCase().includes(searchTerm) ||
        project.status.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: project.id,
          title: project.locationName,
          subtitle: `${project.status} • $${project.totalBudget.toLocaleString()} budget`,
          type: 'project',
          url: '/projects'
        });
      }
    });

    // Search purchase orders
    const purchaseOrders = localStorageService.getPurchaseOrders();
    purchaseOrders.forEach(po => {
      if (
        po.poNumber.toLowerCase().includes(searchTerm) ||
        po.status.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: po.id,
          title: po.poNumber,
          subtitle: `${po.status} • $${po.totalCost.toLocaleString()}`,
          type: 'purchase-order',
          url: '/purchase-orders'
        });
      }
    });

    // Search catalog items
    const catalogItems = localStorageService.getCatalogItems();
    catalogItems.forEach(item => {
      if (
        item.itemName.toLowerCase().includes(searchTerm) ||
        item.sku.toLowerCase().includes(searchTerm) ||
        item.category.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: item.id,
          title: item.itemName,
          subtitle: `${item.sku} • ${item.category}`,
          type: 'catalog-item',
          url: '/inventory/catalog'
        });
      }
    });

    // Search suppliers
    const suppliers = localStorageService.getSuppliers();
    suppliers.forEach(supplier => {
      if (
        supplier.supplierName.toLowerCase().includes(searchTerm) ||
        supplier.contactPerson.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: supplier.id,
          title: supplier.supplierName,
          subtitle: `Contact: ${supplier.contactPerson}`,
          type: 'supplier',
          url: '/suppliers'
        });
      }
    });

    // Search warehouses
    const warehouses = localStorageService.getWarehouses();
    warehouses.forEach(warehouse => {
      if (
        warehouse.warehouseName.toLowerCase().includes(searchTerm) ||
        warehouse.address.toLowerCase().includes(searchTerm)
      ) {
        results.push({
          id: warehouse.id,
          title: warehouse.warehouseName,
          subtitle: warehouse.address,
          type: 'warehouse',
          url: '/warehouses'
        });
      }
    });

    return results.slice(0, 20); // Limit to 20 results
  }, [query]);

  const getTypeLabel = (type: SearchResult['type']) => {
    switch (type) {
      case 'project': return 'Project';
      case 'purchase-order': return 'Purchase Order';
      case 'catalog-item': return 'Catalog Item';
      case 'supplier': return 'Supplier';
      case 'warehouse': return 'Warehouse';
    }
  };

  const getTypeColor = (type: SearchResult['type']) => {
    switch (type) {
      case 'project': return 'bg-blue-500';
      case 'purchase-order': return 'bg-green-500';
      case 'catalog-item': return 'bg-purple-500';
      case 'supplier': return 'bg-orange-500';
      case 'warehouse': return 'bg-teal-500';
    }
  };

  const handleResultClick = (result: SearchResult) => {
    navigate(result.url);
    setOpen(false);
    setQuery('');
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-64 justify-start text-muted-foreground">
          <Search className="mr-2 h-4 w-4" />
          Search everything...
          <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100 ml-auto">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </DialogTrigger>
      
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="px-6 py-4 border-b">
          <DialogTitle className="flex items-center gap-2">
            <Search className="h-4 w-4" />
            Search
          </DialogTitle>
        </DialogHeader>
        
        <div className="px-6 py-4">
          <Input
            placeholder="Search projects, orders, items, suppliers..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full"
            autoFocus
          />
        </div>
        
        {query.trim() && (
          <div className="border-t">
            <ScrollArea className="max-h-80">
              {searchResults.length === 0 ? (
                <div className="p-6 text-center text-muted-foreground">
                  No results found for "{query}"
                </div>
              ) : (
                <div className="p-2">
                  {searchResults.map((result) => (
                    <div
                      key={result.id}
                      className="flex items-center gap-3 p-3 rounded-md hover:bg-accent cursor-pointer"
                      onClick={() => handleResultClick(result)}
                    >
                      <Badge
                        variant="secondary"
                        className={`${getTypeColor(result.type)} text-white text-xs px-2 py-1`}
                      >
                        {getTypeLabel(result.type)}
                      </Badge>
                      
                      <div className="flex-1 min-w-0">
                        <div className="font-medium text-sm truncate">
                          {result.title}
                        </div>
                        <div className="text-xs text-muted-foreground truncate">
                          {result.subtitle}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </ScrollArea>
          </div>
        )}
        
        <div className="px-6 py-3 border-t bg-muted/30 text-xs text-muted-foreground">
          <div className="flex items-center justify-between">
            <span>Press Enter to navigate to first result</span>
            <div className="flex items-center gap-1">
              <kbd className="inline-flex h-5 select-none items-center gap-1 rounded border bg-background px-1.5 font-mono text-[10px] font-medium">
                Esc
              </kbd>
              <span>to close</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}