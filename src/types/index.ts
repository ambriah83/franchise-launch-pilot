// Franchise Launch OS - Core Data Types

export type Status = 'Active' | 'Inactive' | 'Draft' | 'Pending' | 'Approved' | 'Cancelled' | 'Superseded';

export type POStatus = 'Draft' | 'Pending' | 'Approved' | 'Ordered' | 'Partially Shipped' | 'Received' | 'Cancelled' | 'Superseded';

export type LineItemStatus = 'Pending' | 'Ordered' | 'Shipped' | 'Backordered' | 'Received' | 'Cancelled';

export type InvoiceStatus = 'Awaiting Payment' | 'Paid' | 'Disputed';

export type ProjectStatus = 'Planning' | 'In Progress' | 'On Hold' | 'Completed' | 'Cancelled';

// CATALOG Master Items
export interface CatalogItem {
  id: string;
  sku: string;
  itemName: string;
  description: string;
  category: string;
  supplierId: string;
  defaultUnitPrice: number;
  image?: string;
  status: 'Active' | 'Discontinued';
  createdAt: Date;
  updatedAt: Date;
}

// VENDORS Suppliers
export interface Supplier {
  id: string;
  supplierName: string;
  contactPerson: string;
  email: string;
  phone: string;
  address: string;
  avgLeadTimeDays: number;
  createdAt: Date;
  updatedAt: Date;
}

// WAREHOUSES Locations
export interface Warehouse {
  id: string;
  warehouseName: string;
  address: string;
  regionalManagerId: string;
  createdAt: Date;
  updatedAt: Date;
}

// INVENTORY Stock Levels
export interface StockLevel {
  id: string;
  itemId: string;
  warehouseId: string;
  quantityOnHand: number;
  quantityCommitted: number;
  quantityAvailable: number;
  reorderLevel: number;
  status: '🚨 REORDER' | '✅ OK';
  createdAt: Date;
  updatedAt: Date;
}

// PROJECTS Locations
export interface Project {
  id: string;
  locationName: string;
  projectManagerId: string;
  status: ProjectStatus;
  targetOpeningDate: Date;
  totalBudget: number;
  totalCommitted: number;
  totalSpent: number;
  budgetVariance: number;
  createdAt: Date;
  updatedAt: Date;
}

// ORDERS Purchase Orders
export interface PurchaseOrder {
  id: string;
  poNumber: string;
  poId: number;
  parentPoId?: string;
  version: number;
  projectId: string;
  supplierId: string;
  status: POStatus;
  dateCreated: Date;
  dateOrdered?: Date;
  totalCost: number;
  changeOrderReason?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ORDERS Line Items
export interface LineItem {
  id: string;
  poId: string;
  catalogItemId: string;
  quantity: number;
  unitPrice: number;
  lineItemTotal: number;
  status: LineItemStatus;
  createdAt: Date;
  updatedAt: Date;
}

// TEMPLATES Order Kits
export interface OrderKit {
  id: string;
  kitName: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

// TEMPLATES Kit Line Items
export interface KitLineItem {
  id: string;
  kitId: string;
  catalogItemId: string;
  defaultQuantity: number;
  createdAt: Date;
  updatedAt: Date;
}

// RECEIVING Shipment Logs
export interface ShipmentLog {
  id: string;
  poId: string;
  dateReceived: Date;
  carrier: string;
  trackingNumber: string;
  receivedById: string;
  notes?: string;
  createdAt: Date;
  updatedAt: Date;
}

// RECEIVING Shipment Line Items
export interface ShipmentLineItem {
  id: string;
  shipmentId: string;
  lineItemId: string;
  quantityReceived: number;
  quantityDamaged: number;
  createdAt: Date;
  updatedAt: Date;
}

// ACCOUNTS Invoices
export interface Invoice {
  id: string;
  invoiceNumber: string;
  supplierId: string;
  dateIssued: Date;
  dueDate: Date;
  amount: number;
  status: InvoiceStatus;
  invoicePdf?: string;
  createdAt: Date;
  updatedAt: Date;
}

// User Management
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'Admin' | 'Project Manager' | 'Procurement Lead' | 'Executive';
  createdAt: Date;
  updatedAt: Date;
}

// Extended types with relationships
export interface CatalogItemWithRelations extends CatalogItem {
  supplier: Supplier;
  stockLevels: StockLevel[];
}

export interface PurchaseOrderWithRelations extends PurchaseOrder {
  project: Project;
  supplier: Supplier;
  lineItems: LineItemWithRelations[];
  parentPo?: PurchaseOrder;
  childPos: PurchaseOrder[];
}

export interface LineItemWithRelations extends LineItem {
  catalogItem: CatalogItem;
  purchaseOrder: PurchaseOrder;
  shipmentLineItems: ShipmentLineItem[];
}

export interface ProjectWithRelations extends Project {
  projectManager: User;
  purchaseOrders: PurchaseOrder[];
}

export interface StockLevelWithRelations extends StockLevel {
  item: CatalogItem;
  warehouse: Warehouse;
}

// Dashboard & Analytics Types
export interface DashboardStats {
  totalProjects: number;
  activeProjects: number;
  totalBudget: number;
  totalSpent: number;
  budgetVariance: number;
  pendingPOs: number;
  overdueDeliveries: number;
  lowStockItems: number;
}

export interface BudgetAnalysis {
  projectId: string;
  projectName: string;
  budget: number;
  committed: number;
  spent: number;
  variance: number;
  variancePercentage: number;
}

export interface InventoryAlert {
  id: string;
  type: 'LOW_STOCK' | 'OUT_OF_STOCK' | 'OVERSTOCK';
  itemId: string;
  itemName: string;
  warehouseName: string;
  currentStock: number;
  reorderLevel: number;
  severity: 'High' | 'Medium' | 'Low';
}