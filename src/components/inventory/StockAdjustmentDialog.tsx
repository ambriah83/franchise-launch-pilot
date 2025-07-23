import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { useToast } from '@/hooks/use-toast';
import { InventoryItem } from '@/hooks/useInventoryManagement';

interface StockAdjustmentDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onAdjustment: (itemId: string, warehouseId: string, quantityChange: number, reason: string, type: 'adjustment' | 'damage') => Promise<void>;
}

export function StockAdjustmentDialog({ open, onOpenChange, item, onAdjustment }: StockAdjustmentDialogProps) {
  const { toast } = useToast();
  const [selectedWarehouse, setSelectedWarehouse] = useState('');
  const [adjustmentType, setAdjustmentType] = useState<'increase' | 'decrease'>('increase');
  const [quantity, setQuantity] = useState('');
  const [reason, setReason] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !selectedWarehouse || !quantity || !reason) return;

    setIsSubmitting(true);
    try {
      const quantityChange = adjustmentType === 'increase' 
        ? Math.abs(Number(quantity))
        : -Math.abs(Number(quantity));

      const type = reason.toLowerCase().includes('damage') || reason.toLowerCase().includes('loss') 
        ? 'damage' as const
        : 'adjustment' as const;

      await onAdjustment(item.id, selectedWarehouse, quantityChange, reason, type);

      toast({
        title: 'Stock Adjusted',
        description: `Successfully ${adjustmentType === 'increase' ? 'increased' : 'decreased'} stock by ${Math.abs(Number(quantity))} units.`,
      });

      // Reset form
      setSelectedWarehouse('');
      setQuantity('');
      setReason('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to adjust stock. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  const selectedWarehouseStock = item.stockLevels.find(sl => sl.warehouseId === selectedWarehouse);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Adjust Stock</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Item Info */}
          <div className="p-3 bg-muted rounded-lg">
            <div className="font-medium">{item.itemName}</div>
            <div className="text-sm text-muted-foreground">SKU: {item.sku}</div>
            <div className="flex items-center gap-2 mt-2">
              <Badge variant="outline">Total: {item.totalQuantity}</Badge>
              <Badge variant="outline">Available: {item.availableQuantity}</Badge>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Warehouse Selection */}
            <div className="space-y-2">
              <Label htmlFor="warehouse">Warehouse</Label>
              <Select value={selectedWarehouse} onValueChange={setSelectedWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {item.stockLevels.map((stockLevel) => (
                    <SelectItem key={stockLevel.warehouseId} value={stockLevel.warehouseId}>
                      <div className="flex items-center justify-between w-full">
                        <span>Warehouse {stockLevel.warehouseId.slice(-4)}</span>
                        <Badge variant="secondary" className="ml-2">
                          {stockLevel.quantityOnHand} on hand
                        </Badge>
                      </div>
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {selectedWarehouseStock && (
                <div className="text-sm text-muted-foreground">
                  Current: {selectedWarehouseStock.quantityOnHand} on hand, {selectedWarehouseStock.quantityCommitted} committed
                </div>
              )}
            </div>

            {/* Adjustment Type */}
            <div className="space-y-2">
              <Label>Adjustment Type</Label>
              <Select value={adjustmentType} onValueChange={(value: 'increase' | 'decrease') => setAdjustmentType(value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="increase">Increase Stock</SelectItem>
                  <SelectItem value="decrease">Decrease Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Reason */}
            <div className="space-y-2">
              <Label htmlFor="reason">Reason</Label>
              <Textarea
                id="reason"
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Enter reason for adjustment (e.g., damaged goods, inventory correction, etc.)"
                required
                rows={3}
              />
            </div>

            {/* Actions */}
            <div className="flex gap-2 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => onOpenChange(false)}
                className="flex-1"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || !selectedWarehouse || !quantity || !reason}
                className="flex-1"
              >
                {isSubmitting ? 'Adjusting...' : 'Adjust Stock'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}