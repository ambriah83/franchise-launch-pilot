import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Plus, Trash2, ShoppingCart, Package } from "lucide-react";
import { CatalogItem } from "@/types";
import { ItemSelectionDialog } from "./ItemSelectionDialog";

export interface PurchaseOrderLineItem extends CatalogItem {
  quantity: number;
  unitPrice: number;
  lineTotal: number;
}

interface PurchaseOrderLineItemsProps {
  lineItems: PurchaseOrderLineItem[];
  onLineItemsChange: (items: PurchaseOrderLineItem[]) => void;
  supplierId?: string;
  isReadOnly?: boolean;
}

export function PurchaseOrderLineItems({ 
  lineItems, 
  onLineItemsChange, 
  supplierId,
  isReadOnly = false 
}: PurchaseOrderLineItemsProps) {
  const [showItemDialog, setShowItemDialog] = useState(false);

  const updateLineItem = (index: number, updates: Partial<PurchaseOrderLineItem>) => {
    const updatedItems = lineItems.map((item, i) => {
      if (i === index) {
        const updatedItem = { ...item, ...updates };
        // Recalculate line total if quantity or unit price changed
        if ('quantity' in updates || 'unitPrice' in updates) {
          updatedItem.lineTotal = updatedItem.quantity * updatedItem.unitPrice;
        }
        return updatedItem;
      }
      return item;
    });
    onLineItemsChange(updatedItems);
  };

  const removeLineItem = (index: number) => {
    const updatedItems = lineItems.filter((_, i) => i !== index);
    onLineItemsChange(updatedItems);
  };

  const handleItemsSelected = (selectedItems: PurchaseOrderLineItem[]) => {
    // Check for duplicate items and merge quantities if found
    const mergedItems = [...lineItems];
    
    selectedItems.forEach(newItem => {
      const existingIndex = mergedItems.findIndex(item => item.id === newItem.id);
      
      if (existingIndex >= 0) {
        // Merge with existing item
        const existingItem = mergedItems[existingIndex];
        mergedItems[existingIndex] = {
          ...existingItem,
          quantity: existingItem.quantity + newItem.quantity,
          lineTotal: (existingItem.quantity + newItem.quantity) * existingItem.unitPrice
        };
      } else {
        // Add new item
        mergedItems.push(newItem);
      }
    });
    
    onLineItemsChange(mergedItems);
  };

  const subtotal = lineItems.reduce((sum, item) => sum + item.lineTotal, 0);
  const taxRate = 0.0875; // 8.75% tax rate
  const tax = subtotal * taxRate;
  const total = subtotal + tax;

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Order Items</CardTitle>
            <CardDescription>
              {lineItems.length > 0 
                ? `${lineItems.length} item(s) in this order`
                : "Add items to this purchase order"
              }
            </CardDescription>
          </div>
          {!isReadOnly && (
            <Button variant="outline" size="sm" onClick={() => setShowItemDialog(true)}>
              <Plus className="h-4 w-4 mr-2" />
              Add Items
            </Button>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {lineItems.length === 0 ? (
          <div className="border rounded-lg p-8 text-center text-muted-foreground">
            <ShoppingCart className="h-12 w-12 mx-auto mb-4 opacity-50" />
            <p className="font-medium mb-2">No items added yet</p>
            <p className="text-sm">Click "Add Items" to start building your order</p>
          </div>
        ) : (
          <div className="space-y-4">
            {/* Line Items Table */}
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Item</TableHead>
                    <TableHead className="w-24">Quantity</TableHead>
                    <TableHead className="w-32">Unit Price</TableHead>
                    <TableHead className="w-32">Line Total</TableHead>
                    {!isReadOnly && <TableHead className="w-16">Actions</TableHead>}
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {lineItems.map((item, index) => (
                    <TableRow key={`${item.id}-${index}`}>
                      <TableCell>
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span className="font-medium">{item.itemName}</span>
                            <Badge variant="outline" className="text-xs">{item.sku}</Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                          <Badge variant="secondary" className="text-xs">{item.category}</Badge>
                        </div>
                      </TableCell>
                      <TableCell>
                        {isReadOnly ? (
                          <span>{item.quantity}</span>
                        ) : (
                          <Input
                            type="number"
                            min="1"
                            value={item.quantity}
                            onChange={(e) => updateLineItem(index, { quantity: parseInt(e.target.value) || 1 })}
                            className="h-8"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        {isReadOnly ? (
                          <span>${item.unitPrice.toFixed(2)}</span>
                        ) : (
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={item.unitPrice}
                            onChange={(e) => updateLineItem(index, { unitPrice: parseFloat(e.target.value) || 0 })}
                            className="h-8"
                          />
                        )}
                      </TableCell>
                      <TableCell>
                        <span className="font-medium">${item.lineTotal.toFixed(2)}</span>
                      </TableCell>
                      {!isReadOnly && (
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => removeLineItem(index)}
                            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      )}
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            {/* Order Totals */}
            <div className="border-t pt-4">
              <div className="space-y-2 max-w-sm ml-auto">
                <div className="flex justify-between">
                  <span>Subtotal:</span>
                  <span>${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Tax (8.75%):</span>
                  <span>${tax.toFixed(2)}</span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total:</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>

      <ItemSelectionDialog
        open={showItemDialog}
        onOpenChange={setShowItemDialog}
        supplierId={supplierId}
        onItemsSelected={handleItemsSelected}
      />
    </Card>
  );
}