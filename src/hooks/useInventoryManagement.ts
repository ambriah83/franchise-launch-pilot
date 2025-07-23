import { useState, useEffect, useMemo } from 'react';
import { useLocalStorageData } from './useLocalStorage';
import { localStorageService } from '../services/localStorageService';
import { CatalogItem, Warehouse, StockLevel } from '../types';

export interface InventoryItem extends CatalogItem {
  stockLevels: EnhancedStockLevel[];
  totalQuantity: number;
  availableQuantity: number;
  reorderLevel: number;
  isLowStock: boolean;
  isOutOfStock: boolean;
}

export interface EnhancedStockLevel {
  id: string;
  itemId: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityCommitted: number;
  reorderLevel: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface InventoryMovement {
  id: string;
  itemId: string;
  warehouseId: string;
  type: 'adjustment' | 'transfer' | 'purchase' | 'sale' | 'damage';
  quantity: number;
  reason: string;
  createdAt: Date;
  createdBy: string;
}

export interface TransferRequest {
  id: string;
  itemId: string;
  fromWarehouseId: string;
  toWarehouseId: string;
  quantity: number;
  status: 'pending' | 'approved' | 'in_transit' | 'completed' | 'rejected';
  requestedBy: string;
  requestedAt: Date;
  approvedBy?: string;
  approvedAt?: Date;
  completedAt?: Date;
  notes?: string;
}

export const useInventoryManagement = () => {
  const { data: catalogItems, refreshData: refreshCatalog } = useLocalStorageData(
    'catalogItems',
    localStorageService.getCatalogItems
  );

  const { data: warehouses } = useLocalStorageData(
    'warehouses',
    localStorageService.getWarehouses
  );

  const [stockLevels, setStockLevels] = useState<EnhancedStockLevel[]>([]);
  const [movements, setMovements] = useState<InventoryMovement[]>([]);
  const [transfers, setTransfers] = useState<TransferRequest[]>([]);

  // Initialize stock levels from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('stockLevels');
    if (stored) {
      setStockLevels(JSON.parse(stored));
    } else {
      // Initialize with mock stock levels
      const mockStockLevels: EnhancedStockLevel[] = catalogItems.flatMap(item =>
        warehouses.map(warehouse => ({
          id: `${item.id}-${warehouse.id}`,
          itemId: item.id,
          warehouseId: warehouse.id,
          quantityOnHand: Math.floor(Math.random() * 100) + 10,
          quantityCommitted: Math.floor(Math.random() * 20),
          reorderLevel: Math.floor(Math.random() * 30) + 10,
          createdAt: new Date(),
          updatedAt: new Date()
        }))
      );
      setStockLevels(mockStockLevels);
      localStorage.setItem('stockLevels', JSON.stringify(mockStockLevels));
    }
  }, [catalogItems, warehouses]);

  // Initialize movements from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('inventoryMovements');
    if (stored) {
      const parsed = JSON.parse(stored);
      setMovements(parsed.map((m: any) => ({
        ...m,
        createdAt: new Date(m.createdAt)
      })));
    }
  }, []);

  // Initialize transfers from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('transferRequests');
    if (stored) {
      const parsed = JSON.parse(stored);
      setTransfers(parsed.map((t: any) => ({
        ...t,
        requestedAt: new Date(t.requestedAt),
        approvedAt: t.approvedAt ? new Date(t.approvedAt) : undefined,
        completedAt: t.completedAt ? new Date(t.completedAt) : undefined
      })));
    }
  }, []);

  // Enhanced inventory items with stock calculations
  const inventoryItems = useMemo<InventoryItem[]>(() => {
    return catalogItems.map(item => {
      const itemStockLevels = stockLevels.filter(sl => sl.itemId === item.id);
      const totalQuantity = itemStockLevels.reduce((sum, sl) => sum + sl.quantityOnHand, 0);
      const totalCommitted = itemStockLevels.reduce((sum, sl) => sum + sl.quantityCommitted, 0);
      const availableQuantity = totalQuantity - totalCommitted;
      const avgReorderLevel = itemStockLevels.length > 0 
        ? itemStockLevels.reduce((sum, sl) => sum + sl.reorderLevel, 0) / itemStockLevels.length 
        : 0;

      return {
        ...item,
        stockLevels: itemStockLevels,
        totalQuantity,
        availableQuantity,
        reorderLevel: avgReorderLevel,
        isLowStock: availableQuantity <= avgReorderLevel && availableQuantity > 0,
        isOutOfStock: availableQuantity <= 0
      };
    });
  }, [catalogItems, stockLevels]);

  // Stock adjustment function
  const adjustStock = async (
    itemId: string,
    warehouseId: string,
    quantityChange: number,
    reason: string,
    type: InventoryMovement['type'] = 'adjustment'
  ) => {
    const stockLevel = stockLevels.find(sl => sl.itemId === itemId && sl.warehouseId === warehouseId);
    if (!stockLevel) throw new Error('Stock level not found');

    const newQuantity = Math.max(0, stockLevel.quantityOnHand + quantityChange);
    
    // Update stock level
    const updatedStockLevels = stockLevels.map(sl =>
      sl.itemId === itemId && sl.warehouseId === warehouseId
        ? { ...sl, quantityOnHand: newQuantity, updatedAt: new Date() }
        : sl
    );
    setStockLevels(updatedStockLevels);
    localStorage.setItem('stockLevels', JSON.stringify(updatedStockLevels));

    // Record movement
    const movement: InventoryMovement = {
      id: `mov_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemId,
      warehouseId,
      type,
      quantity: quantityChange,
      reason,
      createdAt: new Date(),
      createdBy: 'current_user' // In a real app, this would be the logged-in user
    };

    const updatedMovements = [...movements, movement];
    setMovements(updatedMovements);
    localStorage.setItem('inventoryMovements', JSON.stringify(updatedMovements));

    return movement;
  };

  // Transfer request function
  const createTransferRequest = async (
    itemId: string,
    fromWarehouseId: string,
    toWarehouseId: string,
    quantity: number,
    notes?: string
  ) => {
    const transfer: TransferRequest = {
      id: `tr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      itemId,
      fromWarehouseId,
      toWarehouseId,
      quantity,
      status: 'pending',
      requestedBy: 'current_user',
      requestedAt: new Date(),
      notes
    };

    const updatedTransfers = [...transfers, transfer];
    setTransfers(updatedTransfers);
    localStorage.setItem('transferRequests', JSON.stringify(updatedTransfers));

    return transfer;
  };

  // Approve transfer function
  const approveTransfer = async (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer) throw new Error('Transfer not found');

    // Check if source warehouse has enough stock
    const sourceStock = stockLevels.find(
      sl => sl.itemId === transfer.itemId && sl.warehouseId === transfer.fromWarehouseId
    );
    
    if (!sourceStock || sourceStock.quantityOnHand < transfer.quantity) {
      throw new Error('Insufficient stock for transfer');
    }

    // Update transfer status
    const updatedTransfer = {
      ...transfer,
      status: 'approved' as const,
      approvedBy: 'current_user',
      approvedAt: new Date()
    };

    const updatedTransfers = transfers.map(t => t.id === transferId ? updatedTransfer : t);
    setTransfers(updatedTransfers);
    localStorage.setItem('transferRequests', JSON.stringify(updatedTransfers));

    return updatedTransfer;
  };

  // Complete transfer function
  const completeTransfer = async (transferId: string) => {
    const transfer = transfers.find(t => t.id === transferId);
    if (!transfer || transfer.status !== 'approved') {
      throw new Error('Transfer not found or not approved');
    }

    // Adjust stock levels
    await adjustStock(transfer.itemId, transfer.fromWarehouseId, -transfer.quantity, `Transfer to warehouse`, 'transfer');
    await adjustStock(transfer.itemId, transfer.toWarehouseId, transfer.quantity, `Transfer from warehouse`, 'transfer');

    // Update transfer status
    const updatedTransfer = {
      ...transfer,
      status: 'completed' as const,
      completedAt: new Date()
    };

    const updatedTransfers = transfers.map(t => t.id === transferId ? updatedTransfer : t);
    setTransfers(updatedTransfers);
    localStorage.setItem('transferRequests', JSON.stringify(updatedTransfers));

    return updatedTransfer;
  };

  // Calculate reorder suggestions
  const getReorderSuggestions = () => {
    return inventoryItems
      .filter(item => item.isLowStock || item.isOutOfStock)
      .map(item => {
        // Simple reorder calculation based on recent usage (mock data)
        const avgDailyUsage = Math.random() * 5 + 1; // Mock average daily usage
        const leadTimeDays = 7; // Mock lead time
        const safetyStock = Math.ceil(avgDailyUsage * 3); // 3-day safety stock
        const reorderQuantity = Math.ceil((avgDailyUsage * leadTimeDays) + safetyStock);

        return {
          item: {
            id: item.id,
            name: item.itemName,
            sku: item.sku,
            category: item.category,
            unitCost: item.defaultUnitPrice,
            isOutOfStock: item.isOutOfStock,
            availableQuantity: item.availableQuantity
          },
          suggestedQuantity: reorderQuantity,
          priority: item.isOutOfStock ? 'high' as const : 'medium' as const,
          estimatedCost: reorderQuantity * item.defaultUnitPrice
        };
      })
      .sort((a, b) => {
        if (a.priority === 'high' && b.priority !== 'high') return -1;
        if (b.priority === 'high' && a.priority !== 'high') return 1;
        return b.estimatedCost - a.estimatedCost;
      });
  };

  return {
    inventoryItems,
    stockLevels,
    movements,
    transfers,
    adjustStock,
    createTransferRequest,
    approveTransfer,
    completeTransfer,
    getReorderSuggestions,
    refreshData: refreshCatalog
  };
};