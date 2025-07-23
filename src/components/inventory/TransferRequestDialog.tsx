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

interface TransferRequestDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  item: InventoryItem | null;
  onTransferRequest: (itemId: string, fromWarehouseId: string, toWarehouseId: string, quantity: number, notes?: string) => Promise<void>;
}

export function TransferRequestDialog({ open, onOpenChange, item, onTransferRequest }: TransferRequestDialogProps) {
  const { toast } = useToast();
  const [fromWarehouse, setFromWarehouse] = useState('');
  const [toWarehouse, setToWarehouse] = useState('');
  const [quantity, setQuantity] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!item || !fromWarehouse || !toWarehouse || !quantity) return;

    if (fromWarehouse === toWarehouse) {
      toast({
        title: 'Invalid Transfer',
        description: 'Source and destination warehouses must be different.',
        variant: 'destructive',
      });
      return;
    }

    const sourceStock = item.stockLevels.find(sl => sl.warehouseId === fromWarehouse);
    if (!sourceStock || sourceStock.quantityOnHand < Number(quantity)) {
      toast({
        title: 'Insufficient Stock',
        description: 'Not enough stock available in the source warehouse.',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);
    try {
      await onTransferRequest(item.id, fromWarehouse, toWarehouse, Number(quantity), notes);

      toast({
        title: 'Transfer Request Created',
        description: `Transfer request for ${quantity} units has been submitted for approval.`,
      });

      // Reset form
      setFromWarehouse('');
      setToWarehouse('');
      setQuantity('');
      setNotes('');
      onOpenChange(false);
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to create transfer request. Please try again.',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!item) return null;

  const fromWarehouseStock = item.stockLevels.find(sl => sl.warehouseId === fromWarehouse);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Create Transfer Request</DialogTitle>
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
            {/* From Warehouse */}
            <div className="space-y-2">
              <Label htmlFor="fromWarehouse">From Warehouse</Label>
              <Select value={fromWarehouse} onValueChange={setFromWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select source warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {item.stockLevels
                    .filter(sl => sl.quantityOnHand > 0)
                    .map((stockLevel) => (
                      <SelectItem key={stockLevel.warehouseId} value={stockLevel.warehouseId}>
                        <div className="flex items-center justify-between w-full">
                          <span>Warehouse {stockLevel.warehouseId.slice(-4)}</span>
                          <Badge variant="secondary" className="ml-2">
                            {stockLevel.quantityOnHand} available
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {fromWarehouseStock && (
                <div className="text-sm text-muted-foreground">
                  Available: {fromWarehouseStock.quantityOnHand - fromWarehouseStock.quantityCommitted} units
                </div>
              )}
            </div>

            {/* To Warehouse */}
            <div className="space-y-2">
              <Label htmlFor="toWarehouse">To Warehouse</Label>
              <Select value={toWarehouse} onValueChange={setToWarehouse}>
                <SelectTrigger>
                  <SelectValue placeholder="Select destination warehouse" />
                </SelectTrigger>
                <SelectContent>
                  {item.stockLevels
                    .filter(sl => sl.warehouseId !== fromWarehouse)
                    .map((stockLevel) => (
                      <SelectItem key={stockLevel.warehouseId} value={stockLevel.warehouseId}>
                        <div className="flex items-center justify-between w-full">
                          <span>Warehouse {stockLevel.warehouseId.slice(-4)}</span>
                          <Badge variant="secondary" className="ml-2">
                            {stockLevel.quantityOnHand} current
                          </Badge>
                        </div>
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
            </div>

            {/* Quantity */}
            <div className="space-y-2">
              <Label htmlFor="quantity">Quantity to Transfer</Label>
              <Input
                id="quantity"
                type="number"
                min="1"
                max={fromWarehouseStock ? fromWarehouseStock.quantityOnHand - fromWarehouseStock.quantityCommitted : undefined}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                placeholder="Enter quantity"
                required
              />
            </div>

            {/* Notes */}
            <div className="space-y-2">
              <Label htmlFor="notes">Notes (Optional)</Label>
              <Textarea
                id="notes"
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Enter any additional notes or justification for the transfer"
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
                disabled={isSubmitting || !fromWarehouse || !toWarehouse || !quantity}
                className="flex-1"
              >
                {isSubmitting ? 'Creating...' : 'Create Request'}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  );
}