// LocalStorage Service for Data Persistence
import { 
  Project, 
  PurchaseOrder, 
  CatalogItem, 
  Supplier, 
  Warehouse, 
  StockLevel,
  OrderKit,
  LineItem,
  User,
  InventoryAlert,
  Invoice,
  ShipmentLog
} from '../types';

const STORAGE_KEYS = {
  PROJECTS: 'franchise_projects',
  PURCHASE_ORDERS: 'franchise_purchase_orders',
  CATALOG_ITEMS: 'franchise_catalog_items',
  SUPPLIERS: 'franchise_suppliers',
  WAREHOUSES: 'franchise_warehouses',
  STOCK_LEVELS: 'franchise_stock_levels',
  ORDER_KITS: 'franchise_order_kits',
  LINE_ITEMS: 'franchise_line_items',
  USERS: 'franchise_users',
  INVENTORY_ALERTS: 'franchise_inventory_alerts',
  INVOICES: 'franchise_invoices',
  SHIPMENT_LOGS: 'franchise_shipment_logs',
  SETTINGS: 'franchise_settings'
} as const;

class LocalStorageService {
  // Generic CRUD operations
  private get<T>(key: string): T[] {
    try {
      const data = localStorage.getItem(key);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error(`Error reading ${key} from localStorage:`, error);
      return [];
    }
  }

  private set<T>(key: string, data: T[]): void {
    try {
      localStorage.setItem(key, JSON.stringify(data));
    } catch (error) {
      console.error(`Error writing ${key} to localStorage:`, error);
    }
  }

  private create<T extends { id: string; createdAt: Date; updatedAt: Date }>(
    key: string, 
    item: Omit<T, 'id' | 'createdAt' | 'updatedAt'>
  ): T {
    const items = this.get<T>(key);
    const newItem = {
      ...item,
      id: crypto.randomUUID(),
      createdAt: new Date(),
      updatedAt: new Date()
    } as T;
    
    items.push(newItem);
    this.set(key, items);
    return newItem;
  }

  private update<T extends { id: string; updatedAt: Date }>(
    key: string, 
    id: string, 
    updates: Partial<T>
  ): T | null {
    const items = this.get<T>(key);
    const index = items.findIndex(item => item.id === id);
    
    if (index === -1) return null;
    
    items[index] = {
      ...items[index],
      ...updates,
      updatedAt: new Date()
    };
    
    this.set(key, items);
    return items[index];
  }

  private delete(key: string, id: string): boolean {
    const items = this.get(key);
    const filteredItems = items.filter((item: any) => item.id !== id);
    
    if (filteredItems.length === items.length) return false;
    
    this.set(key, filteredItems);
    return true;
  }

  // Projects
  getProjects(): Project[] {
    return this.get<Project>(STORAGE_KEYS.PROJECTS);
  }

  createProject(project: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project {
    return this.create<Project>(STORAGE_KEYS.PROJECTS, project);
  }

  updateProject(id: string, updates: Partial<Project>): Project | null {
    return this.update<Project>(STORAGE_KEYS.PROJECTS, id, updates);
  }

  deleteProject(id: string): boolean {
    return this.delete(STORAGE_KEYS.PROJECTS, id);
  }

  // Purchase Orders
  getPurchaseOrders(): PurchaseOrder[] {
    return this.get<PurchaseOrder>(STORAGE_KEYS.PURCHASE_ORDERS);
  }

  createPurchaseOrder(po: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): PurchaseOrder {
    return this.create<PurchaseOrder>(STORAGE_KEYS.PURCHASE_ORDERS, po);
  }

  updatePurchaseOrder(id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | null {
    return this.update<PurchaseOrder>(STORAGE_KEYS.PURCHASE_ORDERS, id, updates);
  }

  deletePurchaseOrder(id: string): boolean {
    return this.delete(STORAGE_KEYS.PURCHASE_ORDERS, id);
  }

  // Catalog Items
  getCatalogItems(): CatalogItem[] {
    return this.get<CatalogItem>(STORAGE_KEYS.CATALOG_ITEMS);
  }

  createCatalogItem(item: Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'>): CatalogItem {
    return this.create<CatalogItem>(STORAGE_KEYS.CATALOG_ITEMS, item);
  }

  updateCatalogItem(id: string, updates: Partial<CatalogItem>): CatalogItem | null {
    return this.update<CatalogItem>(STORAGE_KEYS.CATALOG_ITEMS, id, updates);
  }

  deleteCatalogItem(id: string): boolean {
    return this.delete(STORAGE_KEYS.CATALOG_ITEMS, id);
  }

  // Suppliers
  getSuppliers(): Supplier[] {
    return this.get<Supplier>(STORAGE_KEYS.SUPPLIERS);
  }

  createSupplier(supplier: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier {
    return this.create<Supplier>(STORAGE_KEYS.SUPPLIERS, supplier);
  }

  updateSupplier(id: string, updates: Partial<Supplier>): Supplier | null {
    return this.update<Supplier>(STORAGE_KEYS.SUPPLIERS, id, updates);
  }

  deleteSupplier(id: string): boolean {
    return this.delete(STORAGE_KEYS.SUPPLIERS, id);
  }

  // Warehouses
  getWarehouses(): Warehouse[] {
    return this.get<Warehouse>(STORAGE_KEYS.WAREHOUSES);
  }

  createWarehouse(warehouse: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Warehouse {
    return this.create<Warehouse>(STORAGE_KEYS.WAREHOUSES, warehouse);
  }

  updateWarehouse(id: string, updates: Partial<Warehouse>): Warehouse | null {
    return this.update<Warehouse>(STORAGE_KEYS.WAREHOUSES, id, updates);
  }

  deleteWarehouse(id: string): boolean {
    return this.delete(STORAGE_KEYS.WAREHOUSES, id);
  }

  // Stock Levels
  getStockLevels(): StockLevel[] {
    return this.get<StockLevel>(STORAGE_KEYS.STOCK_LEVELS);
  }

  updateStockLevel(id: string, updates: Partial<StockLevel>): StockLevel | null {
    return this.update<StockLevel>(STORAGE_KEYS.STOCK_LEVELS, id, updates);
  }

  // Order Kits
  getOrderKits(): OrderKit[] {
    return this.get<OrderKit>(STORAGE_KEYS.ORDER_KITS);
  }

  createOrderKit(kit: Omit<OrderKit, 'id' | 'createdAt' | 'updatedAt'>): OrderKit {
    return this.create<OrderKit>(STORAGE_KEYS.ORDER_KITS, kit);
  }

  updateOrderKit(id: string, updates: Partial<OrderKit>): OrderKit | null {
    return this.update<OrderKit>(STORAGE_KEYS.ORDER_KITS, id, updates);
  }

  deleteOrderKit(id: string): boolean {
    return this.delete(STORAGE_KEYS.ORDER_KITS, id);
  }

  // Invoices
  getInvoices(): Invoice[] {
    return this.get<Invoice>(STORAGE_KEYS.INVOICES);
  }

  createInvoice(invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice {
    return this.create<Invoice>(STORAGE_KEYS.INVOICES, invoiceData);
  }

  updateInvoice(id: string, updates: Partial<Invoice>): Invoice | null {
    return this.update<Invoice>(STORAGE_KEYS.INVOICES, id, updates);
  }

  deleteInvoice(id: string): boolean {
    return this.delete(STORAGE_KEYS.INVOICES, id);
  }

  // Shipment Logs
  getShipmentLogs(): ShipmentLog[] {
    return this.get<ShipmentLog>(STORAGE_KEYS.SHIPMENT_LOGS);
  }

  createShipmentLog(shipmentData: Omit<ShipmentLog, 'id' | 'createdAt' | 'updatedAt'>): ShipmentLog {
    return this.create<ShipmentLog>(STORAGE_KEYS.SHIPMENT_LOGS, shipmentData);
  }

  updateShipmentLog(id: string, updates: Partial<ShipmentLog>): ShipmentLog | null {
    return this.update<ShipmentLog>(STORAGE_KEYS.SHIPMENT_LOGS, id, updates);
  }

  deleteShipmentLog(id: string): boolean {
    return this.delete(STORAGE_KEYS.SHIPMENT_LOGS, id);
  }

  // Settings
  getSettings(): Record<string, any> {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      return data ? JSON.parse(data) : {};
    } catch {
      return {};
    }
  }

  updateSettings(settings: Record<string, any>): void {
    this.set(STORAGE_KEYS.SETTINGS, [settings]);
  }

  // Data Management
  exportAllData(): string {
    const data = {
      projects: this.getProjects(),
      purchaseOrders: this.getPurchaseOrders(),
      catalogItems: this.getCatalogItems(),
      suppliers: this.getSuppliers(),
      warehouses: this.getWarehouses(),
      stockLevels: this.getStockLevels(),
      orderKits: this.getOrderKits(),
      settings: this.getSettings(),
      exportDate: new Date().toISOString()
    };
    
    return JSON.stringify(data, null, 2);
  }

  importData(jsonData: string): boolean {
    try {
      const data = JSON.parse(jsonData);
      
      if (data.projects) this.set(STORAGE_KEYS.PROJECTS, data.projects);
      if (data.purchaseOrders) this.set(STORAGE_KEYS.PURCHASE_ORDERS, data.purchaseOrders);
      if (data.catalogItems) this.set(STORAGE_KEYS.CATALOG_ITEMS, data.catalogItems);
      if (data.suppliers) this.set(STORAGE_KEYS.SUPPLIERS, data.suppliers);
      if (data.warehouses) this.set(STORAGE_KEYS.WAREHOUSES, data.warehouses);
      if (data.stockLevels) this.set(STORAGE_KEYS.STOCK_LEVELS, data.stockLevels);
      if (data.orderKits) this.set(STORAGE_KEYS.ORDER_KITS, data.orderKits);
      if (data.settings) this.updateSettings(data.settings);
      
      return true;
    } catch (error) {
      console.error('Error importing data:', error);
      return false;
    }
  }

  clearAllData(): void {
    Object.values(STORAGE_KEYS).forEach(key => {
      localStorage.removeItem(key);
    });
  }

  // Initialize with mock data if empty
  initializeWithMockData(mockData: any): void {
    if (this.getProjects().length === 0 && mockData.mockProjects) {
      this.set(STORAGE_KEYS.PROJECTS, mockData.mockProjects);
    }
    if (this.getPurchaseOrders().length === 0 && mockData.mockPurchaseOrders) {
      this.set(STORAGE_KEYS.PURCHASE_ORDERS, mockData.mockPurchaseOrders);
    }
    if (this.getCatalogItems().length === 0 && mockData.mockCatalogItems) {
      this.set(STORAGE_KEYS.CATALOG_ITEMS, mockData.mockCatalogItems);
    }
    if (this.getSuppliers().length === 0 && mockData.mockSuppliers) {
      this.set(STORAGE_KEYS.SUPPLIERS, mockData.mockSuppliers);
    }
    if (this.getWarehouses().length === 0 && mockData.mockWarehouses) {
      this.set(STORAGE_KEYS.WAREHOUSES, mockData.mockWarehouses);
    }
    if (this.getStockLevels().length === 0 && mockData.mockStockLevels) {
      this.set(STORAGE_KEYS.STOCK_LEVELS, mockData.mockStockLevels);
    }
    if (this.getOrderKits().length === 0 && mockData.mockOrderKits) {
      this.set(STORAGE_KEYS.ORDER_KITS, mockData.mockOrderKits);
    }
  }
}

export const localStorageService = new LocalStorageService();