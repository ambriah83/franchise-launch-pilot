import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Search, Package, FileText } from "lucide-react";
import { OrderKit, CatalogItem } from "@/types";
import { localStorageService } from "@/services/localStorageService";
import { PurchaseOrderLineItem } from "./PurchaseOrderLineItems";

interface OrderTemplateDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onTemplateSelected: (items: PurchaseOrderLineItem[]) => void;
}

export function OrderTemplateDialog({ 
  open, 
  onOpenChange, 
  onTemplateSelected 
}: OrderTemplateDialogProps) {
  const [templates, setTemplates] = useState<OrderKit[]>([]);
  const [catalogItems, setCatalogItems] = useState<CatalogItem[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTemplate, setSelectedTemplate] = useState<OrderKit | null>(null);

  useEffect(() => {
    setTemplates(localStorageService.getOrderKits());
    setCatalogItems(localStorageService.getCatalogItems());
  }, []);

  const filteredTemplates = templates.filter(template => 
    template.kitName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.category?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTemplateSelect = (template: OrderKit) => {
    if (!template.lineItems || template.lineItems.length === 0) {
      return;
    }

    // Convert template items to purchase order line items
    const lineItems: PurchaseOrderLineItem[] = template.lineItems
      .map(kitItem => {
        const catalogItem = catalogItems.find(item => item.id === kitItem.catalogItemId);
        if (!catalogItem) return null;

        return {
          ...catalogItem,
          quantity: kitItem.defaultQuantity,
          unitPrice: catalogItem.defaultUnitPrice,
          lineTotal: kitItem.defaultQuantity * catalogItem.defaultUnitPrice
        };
      })
      .filter((item): item is PurchaseOrderLineItem => item !== null);

    onTemplateSelected(lineItems);
    onOpenChange(false);
    setSelectedTemplate(null);
  };

  const getTemplatePreview = (template: OrderKit) => {
    if (!template.lineItems || template.lineItems.length === 0) {
      return { itemCount: 0, totalCost: 0, items: [] };
    }

    const items = template.lineItems
      .map(kitItem => {
        const catalogItem = catalogItems.find(item => item.id === kitItem.catalogItemId);
        return catalogItem ? {
          name: catalogItem.itemName,
          quantity: kitItem.defaultQuantity,
          unitPrice: catalogItem.defaultUnitPrice,
          total: kitItem.defaultQuantity * catalogItem.defaultUnitPrice
        } : null;
      })
      .filter(item => item !== null);

    const totalCost = items.reduce((sum, item) => sum + (item?.total || 0), 0);

    return {
      itemCount: items.length,
      totalCost,
      items: items.slice(0, 3) // Preview first 3 items
    };
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[80vh] overflow-hidden flex flex-col">
        <DialogHeader>
          <DialogTitle>Load from Template</DialogTitle>
          <DialogDescription>
            Choose a pre-configured kit template to quickly add items to your order
          </DialogDescription>
        </DialogHeader>

        {/* Search */}
        <div className="p-4 border-b">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search templates..."
              className="pl-10"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {/* Templates */}
        <div className="flex-1 overflow-y-auto p-4">
          {filteredTemplates.length === 0 ? (
            <div className="border rounded-lg p-8 text-center text-muted-foreground">
              <FileText className="h-12 w-12 mx-auto mb-4 opacity-50" />
              <p className="font-medium mb-2">No templates found</p>
              <p className="text-sm">
                {searchTerm ? "Try adjusting your search terms" : "No order templates have been created yet"}
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {filteredTemplates.map(template => {
                const preview = getTemplatePreview(template);
                
                return (
                  <Card 
                    key={template.id} 
                    className="cursor-pointer hover:shadow-md transition-shadow"
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <CardTitle className="text-lg">{template.kitName}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        {template.category && (
                          <Badge variant="secondary">{template.category}</Badge>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent>
                      <div className="space-y-3">
                        {/* Template Stats */}
                        <div className="flex items-center justify-between text-sm">
                          <div className="flex items-center gap-2">
                            <Package className="h-4 w-4 text-muted-foreground" />
                            <span>{preview.itemCount} items</span>
                          </div>
                          <div className="font-medium">
                            Est. ${preview.totalCost.toFixed(2)}
                          </div>
                        </div>

                        {/* Preview Items */}
                        {preview.items.length > 0 && (
                          <div className="space-y-1">
                            <div className="text-xs text-muted-foreground font-medium">Preview:</div>
                            {preview.items.map((item, index) => (
                              <div key={index} className="text-xs flex justify-between">
                                <span className="truncate flex-1">
                                  {item?.quantity}x {item?.name}
                                </span>
                                <span>${item?.total.toFixed(2)}</span>
                              </div>
                            ))}
                            {template.lineItems && template.lineItems.length > 3 && (
                              <div className="text-xs text-muted-foreground">
                                +{template.lineItems.length - 3} more items...
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                );
              })}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="border-t p-4 flex justify-end">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}