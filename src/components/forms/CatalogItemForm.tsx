import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { CatalogItem } from '../../types';
import { localStorageService } from '../../services/localStorageService';
import { useToast } from '@/hooks/use-toast';

interface CatalogItemFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item?: CatalogItem;
  onSuccess: () => void;
}

function CatalogItemForm({ open, onOpenChange, item, onSuccess }: CatalogItemFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    sku: item?.sku || '',
    itemName: item?.itemName || '',
    description: item?.description || '',
    category: item?.category || '',
    supplierId: item?.supplierId || '',
    defaultUnitPrice: item?.defaultUnitPrice || 0,
    status: item?.status || 'Active' as 'Active' | 'Discontinued'
  });

  const suppliers = localStorageService.getSuppliers();
  const categories = [
    'Kitchen Equipment',
    'Furniture', 
    'Technology',
    'Fixtures',
    'Supplies',
    'Safety Equipment',
    'Other'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.sku.trim() || !formData.itemName.trim()) {
        toast({
          title: "Validation Error",
          description: "SKU and Item Name are required",
          variant: "destructive"
        });
        return;
      }

      if (formData.defaultUnitPrice <= 0) {
        toast({
          title: "Validation Error",
          description: "Price must be greater than 0",
          variant: "destructive"
        });
        return;
      }

      const itemData = {
        sku: formData.sku.trim().toUpperCase(),
        itemName: formData.itemName.trim(),
        description: formData.description.trim(),
        category: formData.category,
        supplierId: formData.supplierId,
        defaultUnitPrice: formData.defaultUnitPrice,
        status: formData.status
      };

      if (item) {
        // Update existing item
        localStorageService.updateCatalogItem(item.id, itemData);
        toast({
          title: "Item Updated",
          description: `${formData.itemName} has been updated successfully.`
        });
      } else {
        // Create new item
        localStorageService.createCatalogItem(itemData);
        toast({
          title: "Item Created",
          description: `${formData.itemName} has been added to the catalog.`
        });
      }

      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        sku: '',
        itemName: '',
        description: '',
        category: '',
        supplierId: '',
        defaultUnitPrice: 0,
        status: 'Active'
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {item ? 'Edit Catalog Item' : 'Add New Catalog Item'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="sku">SKU *</Label>
              <Input
                id="sku"
                value={formData.sku}
                onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
                placeholder="e.g., CHAIR-001"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: 'Active' | 'Discontinued') => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Discontinued">Discontinued</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2 md:col-span-2">
              <Label htmlFor="itemName">Item Name *</Label>
              <Input
                id="itemName"
                value={formData.itemName}
                onChange={(e) => setFormData(prev => ({ ...prev, itemName: e.target.value }))}
                placeholder="e.g., Dining Chair - Standard"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category</Label>
              <Select 
                value={formData.category} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="supplier">Supplier</Label>
              <Select 
                value={formData.supplierId} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, supplierId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select supplier" />
                </SelectTrigger>
                <SelectContent>
                  {suppliers.map(supplier => (
                    <SelectItem key={supplier.id} value={supplier.id}>
                      {supplier.supplierName}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="defaultUnitPrice">Default Unit Price ($) *</Label>
              <Input
                id="defaultUnitPrice"
                type="number"
                min="0"
                step="0.01"
                value={formData.defaultUnitPrice}
                onChange={(e) => setFormData(prev => ({ ...prev, defaultUnitPrice: Number(e.target.value) }))}
                placeholder="85.00"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="Detailed description of the item..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (item ? 'Update Item' : 'Add Item')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

// Named and default exports for compatibility
export { CatalogItemForm };
export default CatalogItemForm;