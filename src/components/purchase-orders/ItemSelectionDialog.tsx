import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Search, Package, Plus, Minus } from "lucide-react";
import { CatalogItem, Supplier } from "@/types";
import { localStorageService } from "@/services/localStorageService";

interface SelectedItem extends CatalogItem {
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface ItemSelectionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  supplierId?: string;
  onItemsSelected: (items: SelectedItem[]) => void;
}

export function ItemSelectionDialog({ 
  open, 
  onOpenChange, 
  supplierId, 
  onItemsSelected 
}: ItemSelectionDialogProps) {
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [suppliers, setSuppliers] = useState<Supplier[]>([]);
  const [selectedItems, setSelectedItems] = useState<SelectedItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [selectedSupplier, setSelectedSupplier] = useState<string>(supplierId || "all");

  useEffect(() => {
    setCatalogItems(localStorageService.getCatalogItems());
    setSuppliers(localStorageService.getSuppliers());
  }, []);

  const filteredItems = catalogItems.filter(item => {
    const matchesSearch = item.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.sku.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
    const matchesSupplier = selectedSupplier === "all" || item.supplierId === selectedSupplier;
    const isActive = item.status === 'Active';
    
    return matchesSearch && matchesCategory && matchesSupplier && isActive;
  });

  const categories = [...new Set(catalogItems.map(item => item.category))];

  const addItem = (item: CatalogItem) => {
    const existingItem = selectedItems.find(selected => selected.id === item.id);
    
    if (existingItem) {
      updateQuantity(item.id, existingItem.quantity + 1);
    } else {
      const newItem: SelectedItem = {
        ...item,
        quantity: 1,
        unitPrice: item.defaultUnitPrice,
        lineTotal: item.defaultUnitPrice
      };
      setSelectedItems([...selectedItems, newItem]);
    }
  };

  const updateQuantity = (itemId: string, quantity: number) => {
    if (quantity <= 0) {
      removeItem(itemId);
      return;
    }

    setSelectedItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, quantity, lineTotal: quantity * item.unitPrice }
          : item
      )
    );
  };

  const updateUnitPrice = (itemId: string, unitPrice: number) => {
    setSelectedItems(items => 
      items.map(item => 
        item.id === itemId 
          ? { ...item, unitPrice, lineTotal: item.quantity * unitPrice }
          : item
      )
    );
  };

  const removeItem = (itemId: string) => {
    setSelectedItems(items => items.filter(item => item.id !== itemId));
  };

  const handleAddToOrder = () => {
    onItemsSelected(selectedItems);
    setSelectedItems([]);
    onOpenChange(false);
  };

  const totalAmount = selectedItems.reduce((sum, item) => sum + item.lineTotal, 0);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Select Items from Catalog</DialogTitle>
          <DialogDescription>
            Choose items from your catalog to add to the purchase order
          </DialogDescription>
        </DialogHeader>

        {/* Filters */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search items..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <Select value={selectedCategory} onValueChange={setSelectedCategory}>
            <SelectTrigger>
              <SelectValue placeholder="All categories" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Categories</SelectItem>
              {categories.map(category => (
                <SelectItem key={category} value={category}>{category}</SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={selectedSupplier} onValueChange={setSelectedSupplier}>
            <SelectTrigger>
              <SelectValue placeholder="All suppliers" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Suppliers</SelectItem>
              {suppliers.map(supplier => (
                <SelectItem key={supplier.id} value={supplier.id}>
                  {supplier.supplierName}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex-1 overflow-hidden grid grid-cols-1 lg:grid-cols-2 gap-4 p-4">
          {/* Available Items */}
          <div className="space-y-4">
            <h3 className="font-semibold">Available Items</h3>
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {filteredItems.map(item => {
                const supplier = suppliers.find(s => s.id === item.supplierId);
                return (
                  <Card key={item.id} className="cursor-pointer hover:shadow-md transition-shadow">
                    <CardContent className="p-3">
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-medium truncate">{item.itemName}</h4>
                            <Badge variant="outline" className="text-xs">{item.sku}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground truncate">{item.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span className="text-sm font-medium">${item.defaultUnitPrice.toFixed(2)}</span>
                            <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                            {supplier && (
                              <span className="text-xs text-muted-foreground">{supplier.supplierName}</span>
                            )}
                          </div>
                        </div>
                        <Button size="sm" onClick={() => addItem(item)}>
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          </div>

          {/* Selected Items */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="font-semibold">Selected Items ({selectedItems.length})</h3>
              <div className="text-sm font-medium">
                Total: ${totalAmount.toFixed(2)}
              </div>
            </div>
            
            <div className="space-y-2 max-h-96 overflow-y-auto">
              {selectedItems.length === 0 ? (
                <div className="border rounded-lg p-6 text-center text-muted-foreground">
                  <Package className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No items selected</p>
                </div>
              ) : (
                selectedItems.map(item => (
                  <Card key={item.id}>
                    <CardContent className="p-3">
                      <div className="space-y-3">
                        <div className="flex items-start justify-between">
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium truncate">{item.itemName}</h4>
                            <Badge variant="outline" className="text-xs mt-1">{item.sku}</Badge>
                          </div>
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => removeItem(item.id)}
                          >
                            <Minus className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <label className="text-xs text-muted-foreground">Quantity</label>
                            <Input
                              type="number"
                              min="1"
                              value={item.quantity}
                              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 1)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Unit Price</label>
                            <Input
                              type="number"
                              min="0"
                              step="0.01"
                              value={item.unitPrice}
                              onChange={(e) => updateUnitPrice(item.id, parseFloat(e.target.value) || 0)}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <label className="text-xs text-muted-foreground">Line Total</label>
                            <div className="h-8 flex items-center text-sm font-medium">
                              ${item.lineTotal.toFixed(2)}
                            </div>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex items-center justify-between">
          <div className="text-sm text-muted-foreground">
            {selectedItems.length} item(s) selected
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => onOpenChange(false)}>
              Cancel
            </Button>
            <Button 
              onClick={handleAddToOrder}
              disabled={selectedItems.length === 0}
            >
              Add to Order
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}