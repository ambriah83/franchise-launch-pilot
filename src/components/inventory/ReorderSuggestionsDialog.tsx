import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { AlertTriangle, ShoppingCart, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ReorderSuggestion {
  item: {
    id: string;
    name: string;
    sku: string;
    category: string;
    unitCost: number;
    isOutOfStock: boolean;
    availableQuantity: number;
  };
  suggestedQuantity: number;
  priority: 'high' | 'medium';
  estimatedCost: number;
}

interface ReorderSuggestionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  suggestions: ReorderSuggestion[];
  onCreatePurchaseOrder: (itemIds: string[]) => void;
}

export function ReorderSuggestionsDialog({ 
  open, 
  onOpenChange, 
  suggestions, 
  onCreatePurchaseOrder 
}: ReorderSuggestionsDialogProps) {
  const { toast } = useToast();

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getPriorityColor = (priority: string) => {
    return priority === 'high' ? 'bg-destructive' : 'bg-warning';
  };

  const getPriorityIcon = (priority: string) => {
    return priority === 'high' ? AlertTriangle : ShoppingCart;
  };

  const totalEstimatedCost = suggestions.reduce((sum, s) => sum + s.estimatedCost, 0);

  const handleCreatePOForAll = () => {
    const itemIds = suggestions.map(s => s.item.id);
    onCreatePurchaseOrder(itemIds);
    onOpenChange(false);
    
    toast({
      title: 'Purchase Order Creation',
      description: `Redirecting to create PO for ${itemIds.length} items.`,
    });
  };

  const handleCreatePOForItem = (itemId: string) => {
    onCreatePurchaseOrder([itemId]);
    onOpenChange(false);
    
    toast({
      title: 'Purchase Order Creation',
      description: 'Redirecting to create PO for selected item.',
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-warning" />
            Reorder Suggestions
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Summary */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Items Needing Reorder</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{suggestions.length}</div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">High Priority Items</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-destructive">
                  {suggestions.filter(s => s.priority === 'high').length}
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-sm font-medium">Total Estimated Cost</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{formatCurrency(totalEstimatedCost)}</div>
              </CardContent>
            </Card>
          </div>

          {/* Bulk Actions */}
          <div className="flex gap-2">
            <Button onClick={handleCreatePOForAll} className="flex items-center gap-2">
              <ShoppingCart className="h-4 w-4" />
              Create PO for All Items
            </Button>
          </div>

          {/* Suggestions List */}
          <div className="space-y-3">
            {suggestions.map((suggestion) => {
              const IconComponent = getPriorityIcon(suggestion.priority);
              
              return (
                <Card key={suggestion.item.id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="space-y-2 flex-1">
                        <div className="flex items-center gap-3">
                          <div>
                            <div className="font-medium">{suggestion.item.name}</div>
                            <div className="text-sm text-muted-foreground">
                              SKU: {suggestion.item.sku} • Category: {suggestion.item.category}
                            </div>
                          </div>
                          <Badge className={getPriorityColor(suggestion.priority)}>
                            <IconComponent className="h-3 w-3 mr-1" />
                            {suggestion.priority.toUpperCase()} PRIORITY
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-muted-foreground">Current Stock:</span>
                            <div className="font-medium">
                              {suggestion.item.availableQuantity} available
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Suggested Qty:</span>
                            <div className="font-medium">
                              {suggestion.suggestedQuantity} units
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Unit Cost:</span>
                            <div className="font-medium">
                              {formatCurrency(suggestion.item.unitCost)}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-muted-foreground">Estimated Cost:</span>
                            <div className="font-medium">
                              {formatCurrency(suggestion.estimatedCost)}
                            </div>
                          </div>
                        </div>
                      </div>

                      <div className="ml-4">
                        <Button 
                          size="sm" 
                          onClick={() => handleCreatePOForItem(suggestion.item.id)}
                          className="flex items-center gap-2"
                        >
                          <ShoppingCart className="h-4 w-4" />
                          Create PO
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {suggestions.length === 0 && (
            <div className="text-center py-8 text-muted-foreground">
              <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <div className="text-lg font-medium mb-2">No Reorder Suggestions</div>
              <div>All items are currently well-stocked.</div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}