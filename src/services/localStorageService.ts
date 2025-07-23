import { 
  Project, 
  ShipmentLog, 
  CatalogItem, 
  Supplier, 
  Warehouse, 
  OrderKit, 
  Invoice, 
  PurchaseOrder 
} from "../types"
import { v4 as uuidv4 } from 'uuid'

const generateId = (): string => {
  return uuidv4()
}

export const localStorageService = {
  // Initialize with mock data
  initializeWithMockData: () => {
    // This can be implemented later if needed
    console.log('Initializing with mock data...')
  },

  // Projects
  getProjects: (): Project[] => {
    const data = localStorage.getItem('projects')
    if (!data) return []
    
    const projects = JSON.parse(data)
    return projects.map((project: any) => ({
      ...project,
      targetOpeningDate: new Date(project.targetOpeningDate),
      createdAt: new Date(project.createdAt),
      updatedAt: new Date(project.updatedAt)
    }))
  },

  createProject: (projectData: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>): Project => {
    const projects = localStorageService.getProjects()
    const newProject: Project = {
      ...projectData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    projects.push(newProject)
    localStorage.setItem('projects', JSON.stringify(projects))
    return newProject
  },

  updateProject: (id: string, updates: Partial<Project>): Project | null => {
    const projects = localStorageService.getProjects()
    const index = projects.findIndex(p => p.id === id)
    
    if (index === -1) return null
    
    const updatedProject = {
      ...projects[index],
      ...updates,
      updatedAt: new Date()
    }
    
    projects[index] = updatedProject
    localStorage.setItem('projects', JSON.stringify(projects))
    return updatedProject
  },

  deleteProject: (id: string): boolean => {
    const projects = localStorageService.getProjects()
    const index = projects.findIndex(p => p.id === id)

    if (index === -1) return false

    projects.splice(index, 1)
    localStorage.setItem('projects', JSON.stringify(projects))
    return true
  },

  // Catalog Items
  getCatalogItems: (): CatalogItem[] => {
    const data = localStorage.getItem('catalogItems')
    if (!data) return []
    
    const items = JSON.parse(data)
    return items.map((item: any) => ({
      ...item,
      createdAt: new Date(item.createdAt),
      updatedAt: new Date(item.updatedAt)
    }))
  },

  createCatalogItem: (itemData: Omit<CatalogItem, 'id' | 'createdAt' | 'updatedAt'>): CatalogItem => {
    const items = localStorageService.getCatalogItems()
    const newItem: CatalogItem = {
      ...itemData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    items.push(newItem)
    localStorage.setItem('catalogItems', JSON.stringify(items))
    return newItem
  },

  updateCatalogItem: (id: string, updates: Partial<CatalogItem>): CatalogItem | null => {
    const items = localStorageService.getCatalogItems()
    const index = items.findIndex(i => i.id === id)
    
    if (index === -1) return null
    
    const updatedItem = {
      ...items[index],
      ...updates,
      updatedAt: new Date()
    }
    
    items[index] = updatedItem
    localStorage.setItem('catalogItems', JSON.stringify(items))
    return updatedItem
  },

  deleteCatalogItem: (id: string): boolean => {
    const items = localStorageService.getCatalogItems()
    const index = items.findIndex(i => i.id === id)

    if (index === -1) return false

    items.splice(index, 1)
    localStorage.setItem('catalogItems', JSON.stringify(items))
    return true
  },

  // Suppliers
  getSuppliers: (): Supplier[] => {
    const data = localStorage.getItem('suppliers')
    if (!data) return []
    
    const suppliers = JSON.parse(data)
    return suppliers.map((supplier: any) => ({
      ...supplier,
      createdAt: new Date(supplier.createdAt),
      updatedAt: new Date(supplier.updatedAt)
    }))
  },

  createSupplier: (supplierData: Omit<Supplier, 'id' | 'createdAt' | 'updatedAt'>): Supplier => {
    const suppliers = localStorageService.getSuppliers()
    const newSupplier: Supplier = {
      ...supplierData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    suppliers.push(newSupplier)
    localStorage.setItem('suppliers', JSON.stringify(suppliers))
    return newSupplier
  },

  updateSupplier: (id: string, updates: Partial<Supplier>): Supplier | null => {
    const suppliers = localStorageService.getSuppliers()
    const index = suppliers.findIndex(s => s.id === id)
    
    if (index === -1) return null
    
    const updatedSupplier = {
      ...suppliers[index],
      ...updates,
      updatedAt: new Date()
    }
    
    suppliers[index] = updatedSupplier
    localStorage.setItem('suppliers', JSON.stringify(suppliers))
    return updatedSupplier
  },

  deleteSupplier: (id: string): boolean => {
    const suppliers = localStorageService.getSuppliers()
    const index = suppliers.findIndex(s => s.id === id)

    if (index === -1) return false

    suppliers.splice(index, 1)
    localStorage.setItem('suppliers', JSON.stringify(suppliers))
    return true
  },

  // Warehouses
  getWarehouses: (): Warehouse[] => {
    const data = localStorage.getItem('warehouses')
    if (!data) return []
    
    const warehouses = JSON.parse(data)
    return warehouses.map((warehouse: any) => ({
      ...warehouse,
      createdAt: new Date(warehouse.createdAt),
      updatedAt: new Date(warehouse.updatedAt)
    }))
  },

  createWarehouse: (warehouseData: Omit<Warehouse, 'id' | 'createdAt' | 'updatedAt'>): Warehouse => {
    const warehouses = localStorageService.getWarehouses()
    const newWarehouse: Warehouse = {
      ...warehouseData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    warehouses.push(newWarehouse)
    localStorage.setItem('warehouses', JSON.stringify(warehouses))
    return newWarehouse
  },

  updateWarehouse: (id: string, updates: Partial<Warehouse>): Warehouse | null => {
    const warehouses = localStorageService.getWarehouses()
    const index = warehouses.findIndex(w => w.id === id)
    
    if (index === -1) return null
    
    const updatedWarehouse = {
      ...warehouses[index],
      ...updates,
      updatedAt: new Date()
    }
    
    warehouses[index] = updatedWarehouse
    localStorage.setItem('warehouses', JSON.stringify(warehouses))
    return updatedWarehouse
  },

  deleteWarehouse: (id: string): boolean => {
    const warehouses = localStorageService.getWarehouses()
    const index = warehouses.findIndex(w => w.id === id)

    if (index === -1) return false

    warehouses.splice(index, 1)
    localStorage.setItem('warehouses', JSON.stringify(warehouses))
    return true
  },

  // Order Kits (Templates)
  getOrderKits: (): OrderKit[] => {
    const data = localStorage.getItem('orderKits')
    if (!data) return []
    
    const kits = JSON.parse(data)
    return kits.map((kit: any) => ({
      ...kit,
      createdAt: new Date(kit.createdAt),
      updatedAt: new Date(kit.updatedAt)
    }))
  },

  createOrderKit: (kitData: Omit<OrderKit, 'id' | 'createdAt' | 'updatedAt'>): OrderKit => {
    const kits = localStorageService.getOrderKits()
    const newKit: OrderKit = {
      ...kitData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    kits.push(newKit)
    localStorage.setItem('orderKits', JSON.stringify(kits))
    return newKit
  },

  updateOrderKit: (id: string, updates: Partial<OrderKit>): OrderKit | null => {
    const kits = localStorageService.getOrderKits()
    const index = kits.findIndex(k => k.id === id)
    
    if (index === -1) return null
    
    const updatedKit = {
      ...kits[index],
      ...updates,
      updatedAt: new Date()
    }
    
    kits[index] = updatedKit
    localStorage.setItem('orderKits', JSON.stringify(kits))
    return updatedKit
  },

  deleteOrderKit: (id: string): boolean => {
    const kits = localStorageService.getOrderKits()
    const index = kits.findIndex(k => k.id === id)

    if (index === -1) return false

    kits.splice(index, 1)
    localStorage.setItem('orderKits', JSON.stringify(kits))
    return true
  },

  // Invoices
  getInvoices: (): Invoice[] => {
    const data = localStorage.getItem('invoices')
    if (!data) return []
    
    const invoices = JSON.parse(data)
    return invoices.map((invoice: any) => ({
      ...invoice,
      dueDate: new Date(invoice.dueDate),
      createdAt: new Date(invoice.createdAt),
      updatedAt: new Date(invoice.updatedAt)
    }))
  },

  createInvoice: (invoiceData: Omit<Invoice, 'id' | 'createdAt' | 'updatedAt'>): Invoice => {
    const invoices = localStorageService.getInvoices()
    const newInvoice: Invoice = {
      ...invoiceData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    invoices.push(newInvoice)
    localStorage.setItem('invoices', JSON.stringify(invoices))
    return newInvoice
  },

  updateInvoice: (id: string, updates: Partial<Invoice>): Invoice | null => {
    const invoices = localStorageService.getInvoices()
    const index = invoices.findIndex(i => i.id === id)
    
    if (index === -1) return null
    
    const updatedInvoice = {
      ...invoices[index],
      ...updates,
      updatedAt: new Date()
    }
    
    invoices[index] = updatedInvoice
    localStorage.setItem('invoices', JSON.stringify(invoices))
    return updatedInvoice
  },

  deleteInvoice: (id: string): boolean => {
    const invoices = localStorageService.getInvoices()
    const index = invoices.findIndex(i => i.id === id)

    if (index === -1) return false

    invoices.splice(index, 1)
    localStorage.setItem('invoices', JSON.stringify(invoices))
    return true
  },

  // Purchase Orders
  getPurchaseOrders: (): PurchaseOrder[] => {
    const data = localStorage.getItem('purchaseOrders')
    if (!data) return []
    
    const orders = JSON.parse(data)
    return orders.map((order: any) => ({
      ...order,
      requestedDate: new Date(order.requestedDate),
      createdAt: new Date(order.createdAt),
      updatedAt: new Date(order.updatedAt),
      lineItems: order.lineItems.map((item: any) => ({
        ...item,
        createdAt: new Date(item.createdAt),
        updatedAt: new Date(item.updatedAt)
      }))
    }))
  },

  createPurchaseOrder: (orderData: Omit<PurchaseOrder, 'id' | 'createdAt' | 'updatedAt'>): PurchaseOrder => {
    const orders = localStorageService.getPurchaseOrders()
    const newOrder: PurchaseOrder = {
      ...orderData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    orders.push(newOrder)
    localStorage.setItem('purchaseOrders', JSON.stringify(orders))
    return newOrder
  },

  updatePurchaseOrder: (id: string, updates: Partial<PurchaseOrder>): PurchaseOrder | null => {
    const orders = localStorageService.getPurchaseOrders()
    const index = orders.findIndex(o => o.id === id)
    
    if (index === -1) return null
    
    const updatedOrder = {
      ...orders[index],
      ...updates,
      updatedAt: new Date()
    }
    
    orders[index] = updatedOrder
    localStorage.setItem('purchaseOrders', JSON.stringify(orders))
    return updatedOrder
  },

  deletePurchaseOrder: (id: string): boolean => {
    const orders = localStorageService.getPurchaseOrders()
    const index = orders.findIndex(o => o.id === id)

    if (index === -1) return false

    orders.splice(index, 1)
    localStorage.setItem('purchaseOrders', JSON.stringify(orders))
    return true
  },

  // Shipment Logs
  getShipmentLogs: (): ShipmentLog[] => {
    const data = localStorage.getItem('shipmentLogs')
    if (!data) return []
    
    const shipments = JSON.parse(data)
    return shipments.map((shipment: any) => ({
      ...shipment,
      dateReceived: new Date(shipment.dateReceived),
      createdAt: new Date(shipment.createdAt),
      updatedAt: new Date(shipment.updatedAt)
    }))
  },

  createShipmentLog: (shipmentData: Omit<ShipmentLog, 'id' | 'createdAt' | 'updatedAt'>): ShipmentLog => {
    const shipments = localStorageService.getShipmentLogs()
    const newShipment: ShipmentLog = {
      ...shipmentData,
      id: generateId(),
      createdAt: new Date(),
      updatedAt: new Date()
    }
    
    shipments.push(newShipment)
    localStorage.setItem('shipmentLogs', JSON.stringify(shipments))
    return newShipment
  },

  updateShipmentLog: (id: string, updates: Partial<ShipmentLog>): ShipmentLog | null => {
    const shipments = localStorageService.getShipmentLogs()
    const index = shipments.findIndex(s => s.id === id)
    
    if (index === -1) return null
    
    const updatedShipment = {
      ...shipments[index],
      ...updates,
      updatedAt: new Date()
    }
    
    shipments[index] = updatedShipment
    localStorage.setItem('shipmentLogs', JSON.stringify(shipments))
    return updatedShipment
  },

  deleteShipmentLog: (id: string): boolean => {
    const shipmentLogs = localStorageService.getShipmentLogs()
    const index = shipmentLogs.findIndex(s => s.id === id)

    if (index === -1) return false

    shipmentLogs.splice(index, 1)
    localStorage.setItem('shipmentLogs', JSON.stringify(shipmentLogs))
    return true
  },
}
