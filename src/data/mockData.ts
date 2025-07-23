// Mock Data Service for Franchise Launch OS
import { 
  CatalogItem, 
  Supplier, 
  Warehouse, 
  Project, 
  PurchaseOrder, 
  LineItem, 
  OrderKit, 
  KitLineItem, 
  User,
  StockLevel,
  ShipmentLog,
  Invoice,
  DashboardStats,
  BudgetAnalysis,
  InventoryAlert
} from '../types';

// Users
export const mockUsers: User[] = [
  {
    id: '1',
    name: 'Sarah Chen',
    email: 'sarah.chen@franchise.com',
    role: 'Project Manager',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Michael Rodriguez',
    email: 'michael.rodriguez@franchise.com',
    role: 'Procurement Lead',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    name: 'Jennifer Kim',
    email: 'jennifer.kim@franchise.com',
    role: 'Executive',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Suppliers
export const mockSuppliers: Supplier[] = [
  {
    id: '1',
    supplierName: 'Commercial Kitchen Solutions',
    contactPerson: 'John Smith',
    email: 'john@cksolutions.com',
    phone: '(555) 123-4567',
    address: '123 Industrial Blvd, Chicago, IL 60601',
    avgLeadTimeDays: 14,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    supplierName: 'Restaurant Furniture Co',
    contactPerson: 'Lisa Johnson',
    email: 'lisa@restfurniture.com',
    phone: '(555) 234-5678',
    address: '456 Furniture Row, Atlanta, GA 30309',
    avgLeadTimeDays: 21,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    supplierName: 'TechPOS Systems',
    contactPerson: 'David Park',
    email: 'david@techpos.com',
    phone: '(555) 345-6789',
    address: '789 Tech Drive, Austin, TX 78701',
    avgLeadTimeDays: 7,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Warehouses
export const mockWarehouses: Warehouse[] = [
  {
    id: '1',
    warehouseName: 'Central Distribution Center',
    address: '1000 Logistics Pkwy, Dallas, TX 75201',
    regionalManagerId: '2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    warehouseName: 'East Coast Hub',
    address: '2000 Shipping Lane, Miami, FL 33101',
    regionalManagerId: '2',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Catalog Items
export const mockCatalogItems: CatalogItem[] = [
  {
    id: '1',
    sku: 'KIT-GRILL-001',
    itemName: 'Commercial Grill Station',
    description: 'Heavy-duty commercial grill with dual burners',
    category: 'Kitchen Equipment',
    supplierId: '1',
    defaultUnitPrice: 2500.00,
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    sku: 'FUR-TABLE-001',
    itemName: 'Restaurant Table (4-seat)',
    description: 'Solid wood table for 4 customers',
    category: 'Furniture',
    supplierId: '2',
    defaultUnitPrice: 450.00,
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    sku: 'FUR-CHAIR-001',
    itemName: 'Restaurant Chair',
    description: 'Comfortable dining chair with cushion',
    category: 'Furniture',
    supplierId: '2',
    defaultUnitPrice: 85.00,
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '4',
    sku: 'POS-TERM-001',
    itemName: 'POS Terminal',
    description: 'Touch screen POS system with payment processing',
    category: 'Technology',
    supplierId: '3',
    defaultUnitPrice: 1200.00,
    status: 'Active',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Projects
export const mockProjects: Project[] = [
  {
    id: '1',
    locationName: 'Queen Creek',
    projectManagerId: '1',
    status: 'In Progress',
    targetOpeningDate: new Date('2024-08-15'),
    totalBudget: 250000.00,
    totalCommitted: 185000.00,
    totalSpent: 125000.00,
    budgetVariance: 65000.00,
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '2',
    locationName: 'San Tan Valley',
    projectManagerId: '1',
    status: 'Planning',
    targetOpeningDate: new Date('2024-10-01'),
    totalBudget: 275000.00,
    totalCommitted: 45000.00,
    totalSpent: 15000.00,
    budgetVariance: 230000.00,
    createdAt: new Date('2024-03-15'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '3',
    locationName: 'Scottsdale',
    projectManagerId: '1',
    status: 'Completed',
    targetOpeningDate: new Date('2024-06-01'),
    totalBudget: 300000.00,
    totalCommitted: 295000.00,
    totalSpent: 292000.00,
    budgetVariance: 8000.00,
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-06-01')
  },
  {
    id: '4',
    locationName: 'South Gilbert',
    projectManagerId: '1',
    status: 'On Hold',
    targetOpeningDate: new Date('2024-12-15'),
    totalBudget: 280000.00,
    totalCommitted: 25000.00,
    totalSpent: 8000.00,
    budgetVariance: 255000.00,
    createdAt: new Date('2024-04-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '5',
    locationName: 'Tempe',
    projectManagerId: '1',
    status: 'Planning',
    targetOpeningDate: new Date('2024-11-01'),
    totalBudget: 295000.00,
    totalCommitted: 35000.00,
    totalSpent: 12000.00,
    budgetVariance: 260000.00,
    createdAt: new Date('2024-05-15'),
    updatedAt: new Date('2024-07-15')
  }
];

// Order Kits
export const mockOrderKits: OrderKit[] = [
  {
    id: '1',
    kitName: 'Standard FF&E Package',
    description: 'Complete furniture, fixtures, and equipment package for new locations',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '2',
    kitName: 'Kitchen Essentials',
    description: 'Basic kitchen equipment starter package',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  },
  {
    id: '3',
    kitName: 'Technology Setup',
    description: 'POS systems and tech infrastructure',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-01')
  }
];

// Kit Line Items
export const mockKitLineItems: KitLineItem[] = [
  // Standard FF&E Package
  { id: '1', kitId: '1', catalogItemId: '1', defaultQuantity: 2, createdAt: new Date(), updatedAt: new Date() },
  { id: '2', kitId: '1', catalogItemId: '2', defaultQuantity: 8, createdAt: new Date(), updatedAt: new Date() },
  { id: '3', kitId: '1', catalogItemId: '3', defaultQuantity: 32, createdAt: new Date(), updatedAt: new Date() },
  { id: '4', kitId: '1', catalogItemId: '4', defaultQuantity: 3, createdAt: new Date(), updatedAt: new Date() },
  
  // Kitchen Essentials
  { id: '5', kitId: '2', catalogItemId: '1', defaultQuantity: 1, createdAt: new Date(), updatedAt: new Date() },
  
  // Technology Setup
  { id: '6', kitId: '3', catalogItemId: '4', defaultQuantity: 2, createdAt: new Date(), updatedAt: new Date() }
];

// Purchase Orders
export const mockPurchaseOrders: PurchaseOrder[] = [
  {
    id: '1',
    poNumber: 'PO-1001-v1',
    poId: 1001,
    version: 1,
    projectId: '1',
    supplierId: '1',
    status: 'Ordered',
    dateCreated: new Date('2024-06-01'),
    dateOrdered: new Date('2024-06-03'),
    totalCost: 15000.00,
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-03')
  },
  {
    id: '2',
    poNumber: 'PO-1002-v1',
    poId: 1002,
    version: 1,
    projectId: '1',
    supplierId: '2',
    status: 'Partially Shipped',
    dateCreated: new Date('2024-06-15'),
    dateOrdered: new Date('2024-06-16'),
    totalCost: 28500.00,
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-07-10')
  },
  {
    id: '3',
    poNumber: 'PO-1003-v1',
    poId: 1003,
    version: 1,
    projectId: '2',
    supplierId: '3',
    status: 'Draft',
    dateCreated: new Date('2024-07-10'),
    totalCost: 3600.00,
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-10')
  }
];

// Line Items
export const mockLineItems: LineItem[] = [
  {
    id: '1',
    poId: '1',
    catalogItemId: '1',
    quantity: 2,
    unitPrice: 2500.00,
    lineItemTotal: 5000.00,
    status: 'Shipped',
    createdAt: new Date('2024-06-01'),
    updatedAt: new Date('2024-06-25')
  },
  {
    id: '2',
    poId: '2',
    catalogItemId: '2',
    quantity: 8,
    unitPrice: 450.00,
    lineItemTotal: 3600.00,
    status: 'Received',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-07-05')
  },
  {
    id: '3',
    poId: '2',
    catalogItemId: '3',
    quantity: 32,
    unitPrice: 85.00,
    lineItemTotal: 2720.00,
    status: 'Shipped',
    createdAt: new Date('2024-06-15'),
    updatedAt: new Date('2024-07-10')
  },
  {
    id: '4',
    poId: '3',
    catalogItemId: '4',
    quantity: 3,
    unitPrice: 1200.00,
    lineItemTotal: 3600.00,
    status: 'Pending',
    createdAt: new Date('2024-07-10'),
    updatedAt: new Date('2024-07-10')
  }
];

// Stock Levels
export const mockStockLevels: StockLevel[] = [
  {
    id: '1',
    itemId: '1',
    warehouseId: '1',
    quantityOnHand: 5,
    quantityCommitted: 3,
    quantityAvailable: 2,
    reorderLevel: 3,
    status: '✅ OK',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '2',
    itemId: '2',
    warehouseId: '1',
    quantityOnHand: 12,
    quantityCommitted: 8,
    quantityAvailable: 4,
    reorderLevel: 5,
    status: '✅ OK',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-15')
  },
  {
    id: '3',
    itemId: '4',
    warehouseId: '2',
    quantityOnHand: 2,
    quantityCommitted: 3,
    quantityAvailable: -1,
    reorderLevel: 5,
    status: '🚨 REORDER',
    createdAt: new Date('2024-07-01'),
    updatedAt: new Date('2024-07-15')
  }
];

// Dashboard Stats
export const mockDashboardStats: DashboardStats = {
  totalProjects: 12,
  activeProjects: 8,
  totalBudget: 3250000,
  totalSpent: 1890000,
  budgetVariance: 1360000,
  pendingPOs: 15,
  overdueDeliveries: 3,
  lowStockItems: 7
};

// Budget Analysis
export const mockBudgetAnalysis: BudgetAnalysis[] = [
  {
    projectId: '1',
    projectName: 'Queen Creek',
    budget: 250000,
    committed: 185000,
    spent: 125000,
    variance: 65000,
    variancePercentage: 26
  },
  {
    projectId: '2',
    projectName: 'San Tan Valley',
    budget: 275000,
    committed: 45000,
    spent: 15000,
    variance: 230000,
    variancePercentage: 84
  },
  {
    projectId: '3',
    projectName: 'Scottsdale',
    budget: 300000,
    committed: 295000,
    spent: 292000,
    variance: 8000,
    variancePercentage: 3
  },
  {
    projectId: '4',
    projectName: 'South Gilbert',
    budget: 280000,
    committed: 25000,
    spent: 8000,
    variance: 255000,
    variancePercentage: 91
  },
  {
    projectId: '5',
    projectName: 'Tempe',
    budget: 295000,
    committed: 35000,
    spent: 12000,
    variance: 260000,
    variancePercentage: 88
  }
];

// Inventory Alerts
export const mockInventoryAlerts: InventoryAlert[] = [
  {
    id: '1',
    type: 'LOW_STOCK',
    itemId: '4',
    itemName: 'POS Terminal',
    warehouseName: 'East Coast Hub',
    currentStock: 2,
    reorderLevel: 5,
    severity: 'High'
  },
  {
    id: '2',
    type: 'LOW_STOCK',
    itemId: '1',
    itemName: 'Commercial Grill Station',
    warehouseName: 'Central Distribution Center',
    currentStock: 2,
    reorderLevel: 3,
    severity: 'Medium'
  }
];

// Helper functions to get related data
export const getSupplierById = (id: string): Supplier | undefined => 
  mockSuppliers.find(supplier => supplier.id === id);

export const getCatalogItemById = (id: string): CatalogItem | undefined =>
  mockCatalogItems.find(item => item.id === id);

export const getProjectById = (id: string): Project | undefined =>
  mockProjects.find(project => project.id === id);

export const getUserById = (id: string): User | undefined =>
  mockUsers.find(user => user.id === id);

export const getWarehouseById = (id: string): Warehouse | undefined =>
  mockWarehouses.find(warehouse => warehouse.id === id);

export const getLineItemsByPoId = (poId: string): LineItem[] =>
  mockLineItems.filter(item => item.poId === poId);

export const getKitLineItemsByKitId = (kitId: string): KitLineItem[] =>
  mockKitLineItems.filter(item => item.kitId === kitId);