import { useMemo, useState } from 'react';
import { localStorageService } from '../services/localStorageService';

export interface SearchFilters {
  types: string[];
  dateRange: {
    start?: Date;
    end?: Date;
  };
  status?: string[];
  categories?: string[];
  priceRange?: {
    min?: number;
    max?: number;
  };
  sortBy: 'relevance' | 'date' | 'name' | 'price';
  sortOrder: 'asc' | 'desc';
}

export interface SearchResult {
  id: string;
  title: string;
  subtitle: string;
  type: 'project' | 'purchase-order' | 'catalog-item' | 'supplier' | 'warehouse' | 'invoice' | 'shipment-log';
  url: string;
  createdAt: Date;
  updatedAt: Date;
  matchScore: number;
  metadata?: Record<string, any>;
}

const defaultFilters: SearchFilters = {
  types: [],
  dateRange: {},
  status: [],
  categories: [],
  priceRange: {},
  sortBy: 'relevance',
  sortOrder: 'desc'
};

export const useAdvancedSearch = (query: string) => {
  const [filters, setFilters] = useState<SearchFilters>(defaultFilters);
  const [isLoading, setIsLoading] = useState(false);

  const searchResults = useMemo(() => {
    if (!query.trim()) return [];

    setIsLoading(true);
    const results: SearchResult[] = [];
    const searchTerm = query.toLowerCase();

    // Helper function to calculate match score
    const calculateMatchScore = (text: string, searchTerm: string): number => {
      const lowerText = text.toLowerCase();
      if (lowerText === searchTerm) return 100;
      if (lowerText.startsWith(searchTerm)) return 90;
      if (lowerText.includes(` ${searchTerm}`)) return 80;
      if (lowerText.includes(searchTerm)) return 70;
      return 0;
    };

    // Helper function to check if item matches filters
    const matchesFilters = (item: any, type: string): boolean => {
      // Type filter
      if (filters.types.length > 0 && !filters.types.includes(type)) {
        return false;
      }

      // Date range filter
      if (filters.dateRange.start || filters.dateRange.end) {
        const itemDate = new Date(item.createdAt || item.orderDate || item.dueDate);
        if (filters.dateRange.start && itemDate < filters.dateRange.start) return false;
        if (filters.dateRange.end && itemDate > filters.dateRange.end) return false;
      }

      // Status filter
      if (filters.status && filters.status.length > 0 && item.status) {
        if (!filters.status.includes(item.status)) return false;
      }

      // Category filter
      if (filters.categories && filters.categories.length > 0 && item.category) {
        if (!filters.categories.includes(item.category)) return false;
      }

      // Price range filter
      if (filters.priceRange.min !== undefined || filters.priceRange.max !== undefined) {
        const price = item.unitPrice || item.totalCost || item.totalBudget || item.amount || 0;
        if (filters.priceRange.min !== undefined && price < filters.priceRange.min) return false;
        if (filters.priceRange.max !== undefined && price > filters.priceRange.max) return false;
      }

      return true;
    };

    // Search projects
    const projects = localStorageService.getProjects();
    projects.forEach(project => {
      const titleScore = calculateMatchScore(project.locationName, searchTerm);
      const statusScore = calculateMatchScore(project.status, searchTerm);
      const maxScore = Math.max(titleScore, statusScore);

      if (maxScore > 0 && matchesFilters(project, 'project')) {
        results.push({
          id: project.id,
          title: project.locationName,
          subtitle: `${project.status} • $${project.totalBudget.toLocaleString()} budget`,
          type: 'project',
          url: '/projects',
          createdAt: new Date(project.createdAt),
          updatedAt: new Date(project.updatedAt),
          matchScore: maxScore,
          metadata: { budget: project.totalBudget, status: project.status }
        });
      }
    });

    // Search purchase orders
    const purchaseOrders = localStorageService.getPurchaseOrders();
    purchaseOrders.forEach(po => {
      const titleScore = calculateMatchScore(po.poNumber, searchTerm);
      const statusScore = calculateMatchScore(po.status, searchTerm);
      const maxScore = Math.max(titleScore, statusScore);

      if (maxScore > 0 && matchesFilters(po, 'purchase-order')) {
        results.push({
          id: po.id,
          title: po.poNumber,
          subtitle: `${po.status} • $${po.totalCost.toLocaleString()}`,
          type: 'purchase-order',
          url: '/purchase-orders',
          createdAt: new Date(po.createdAt),
          updatedAt: new Date(po.updatedAt),
          matchScore: maxScore,
          metadata: { cost: po.totalCost, status: po.status }
        });
      }
    });

    // Search catalog items
    const catalogItems = localStorageService.getCatalogItems();
    catalogItems.forEach(item => {
      const nameScore = calculateMatchScore(item.itemName, searchTerm);
      const skuScore = calculateMatchScore(item.sku, searchTerm);
      const categoryScore = calculateMatchScore(item.category, searchTerm);
      const descScore = item.description ? calculateMatchScore(item.description, searchTerm) : 0;
      const maxScore = Math.max(nameScore, skuScore, categoryScore, descScore);

      if (maxScore > 0 && matchesFilters(item, 'catalog-item')) {
        results.push({
          id: item.id,
          title: item.itemName,
          subtitle: `${item.sku} • ${item.category}`,
          type: 'catalog-item',
          url: '/inventory/catalog',
          createdAt: new Date(item.createdAt),
          updatedAt: new Date(item.updatedAt),
          matchScore: maxScore,
          metadata: { price: item.defaultUnitPrice, category: item.category, sku: item.sku }
        });
      }
    });

    // Search suppliers
    const suppliers = localStorageService.getSuppliers();
    suppliers.forEach(supplier => {
      const nameScore = calculateMatchScore(supplier.supplierName, searchTerm);
      const contactScore = calculateMatchScore(supplier.contactPerson, searchTerm);
      const emailScore = calculateMatchScore(supplier.email, searchTerm);
      const maxScore = Math.max(nameScore, contactScore, emailScore);

      if (maxScore > 0 && matchesFilters(supplier, 'supplier')) {
        results.push({
          id: supplier.id,
          title: supplier.supplierName,
          subtitle: `Contact: ${supplier.contactPerson}`,
          type: 'supplier',
          url: '/suppliers',
          createdAt: new Date(supplier.createdAt),
          updatedAt: new Date(supplier.updatedAt),
          matchScore: maxScore,
          metadata: { contact: supplier.contactPerson, email: supplier.email }
        });
      }
    });

    // Search warehouses
    const warehouses = localStorageService.getWarehouses();
    warehouses.forEach(warehouse => {
      const nameScore = calculateMatchScore(warehouse.warehouseName, searchTerm);
      const addressScore = calculateMatchScore(warehouse.address, searchTerm);
      const maxScore = Math.max(nameScore, addressScore);

      if (maxScore > 0 && matchesFilters(warehouse, 'warehouse')) {
        results.push({
          id: warehouse.id,
          title: warehouse.warehouseName,
          subtitle: warehouse.address,
          type: 'warehouse',
          url: '/warehouses',
          createdAt: new Date(warehouse.createdAt),
          updatedAt: new Date(warehouse.updatedAt),
          matchScore: maxScore,
          metadata: { address: warehouse.address }
        });
      }
    });

    // Search invoices
    const invoices = localStorageService.getInvoices();
    invoices.forEach(invoice => {
      const numberScore = calculateMatchScore(invoice.invoiceNumber, searchTerm);
      const statusScore = calculateMatchScore(invoice.status, searchTerm);
      const maxScore = Math.max(numberScore, statusScore);

      if (maxScore > 0 && matchesFilters(invoice, 'invoice')) {
        results.push({
          id: invoice.id,
          title: invoice.invoiceNumber,
          subtitle: `${invoice.status} • $${invoice.amount.toLocaleString()}`,
          type: 'invoice',
          url: '/invoices',
          createdAt: new Date(invoice.createdAt),
          updatedAt: new Date(invoice.updatedAt),
          matchScore: maxScore,
          metadata: { amount: invoice.amount, status: invoice.status }
        });
      }
    });

    // Search shipment logs
    const shipmentLogs = localStorageService.getShipmentLogs();
    shipmentLogs.forEach(shipment => {
      const idScore = calculateMatchScore(shipment.shipmentId, searchTerm);
      const poScore = calculateMatchScore(shipment.poNumber, searchTerm);
      const carrierScore = calculateMatchScore(shipment.carrier, searchTerm);
      const trackingScore = shipment.trackingNumber ? calculateMatchScore(shipment.trackingNumber, searchTerm) : 0;
      const maxScore = Math.max(idScore, poScore, carrierScore, trackingScore);

      if (maxScore > 0 && matchesFilters(shipment, 'shipment-log')) {
        results.push({
          id: shipment.id,
          title: shipment.shipmentId,
          subtitle: `${shipment.carrier} • PO: ${shipment.poNumber}`,
          type: 'shipment-log',
          url: '/receiving',
          createdAt: new Date(shipment.createdAt),
          updatedAt: new Date(shipment.updatedAt),
          matchScore: maxScore,
          metadata: { carrier: shipment.carrier, trackingNumber: shipment.trackingNumber }
        });
      }
    });

    // Sort results
    const sortedResults = results.sort((a, b) => {
      switch (filters.sortBy) {
        case 'date':
          const dateA = filters.sortOrder === 'desc' ? b.createdAt.getTime() : a.createdAt.getTime();
          const dateB = filters.sortOrder === 'desc' ? a.createdAt.getTime() : b.createdAt.getTime();
          return dateA - dateB;
        case 'name':
          return filters.sortOrder === 'desc' 
            ? b.title.localeCompare(a.title)
            : a.title.localeCompare(b.title);
        case 'price':
          const priceA = a.metadata?.price || a.metadata?.cost || a.metadata?.budget || a.metadata?.amount || 0;
          const priceB = b.metadata?.price || b.metadata?.cost || b.metadata?.budget || b.metadata?.amount || 0;
          return filters.sortOrder === 'desc' ? priceB - priceA : priceA - priceB;
        case 'relevance':
        default:
          return filters.sortOrder === 'desc' ? b.matchScore - a.matchScore : a.matchScore - b.matchScore;
      }
    });

    setIsLoading(false);
    return sortedResults.slice(0, 50); // Limit to 50 results
  }, [query, filters]);

  const updateFilters = (newFilters: Partial<SearchFilters>) => {
    setFilters(prev => ({ ...prev, ...newFilters }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
  };

  return {
    searchResults,
    filters,
    updateFilters,
    resetFilters,
    isLoading
  };
};