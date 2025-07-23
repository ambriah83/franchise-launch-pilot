import { z } from 'zod';

// Common validation patterns
const dateString = z.string().refine((date) => !isNaN(Date.parse(date)), {
  message: "Invalid date format"
});

// Project validation schema
export const projectSchema = z.object({
  locationName: z.string().min(1, "Location name is required"),
  address: z.string().min(1, "Address is required"),
  totalBudget: z.number().positive("Budget must be positive"),
  status: z.enum(['Planning', 'In Progress', 'Completed', 'On Hold']),
  managerId: z.string().min(1, "Manager ID is required"),
  completionDate: dateString.optional(),
});

// Purchase Order validation schema
export const purchaseOrderSchema = z.object({
  poNumber: z.string().min(1, "PO number is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  projectId: z.string().min(1, "Project is required"),
  totalCost: z.number().positive("Total cost must be positive"),
  status: z.enum(['Draft', 'Submitted', 'Approved', 'Received', 'Cancelled']),
  orderDate: dateString,
  expectedDeliveryDate: dateString,
  notes: z.string().optional(),
});

// Catalog Item validation schema
export const catalogItemSchema = z.object({
  itemName: z.string().min(1, "Item name is required"),
  sku: z.string().min(1, "SKU is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  unitPrice: z.number().positive("Unit price must be positive"),
  supplier: z.string().min(1, "Supplier is required"),
  reorderPoint: z.number().min(0, "Reorder point cannot be negative"),
  status: z.enum(['Active', 'Inactive', 'Discontinued']),
});

// Supplier validation schema
export const supplierSchema = z.object({
  supplierName: z.string().min(1, "Supplier name is required"),
  contactPerson: z.string().min(1, "Contact person is required"),
  email: z.string().email("Invalid email format"),
  phone: z.string().min(1, "Phone number is required"),
  address: z.string().min(1, "Address is required"),
  status: z.enum(['Active', 'Inactive']),
  paymentTerms: z.string().optional(),
});

// Warehouse validation schema
export const warehouseSchema = z.object({
  warehouseName: z.string().min(1, "Warehouse name is required"),
  address: z.string().min(1, "Address is required"),
  capacity: z.number().positive("Capacity must be positive"),
  managerId: z.string().min(1, "Manager ID is required"),
  status: z.enum(['Active', 'Inactive']),
});

// Invoice validation schema
export const invoiceSchema = z.object({
  invoiceNumber: z.string().min(1, "Invoice number is required"),
  supplierId: z.string().min(1, "Supplier is required"),
  amount: z.number().positive("Amount must be positive"),
  dueDate: dateString,
  status: z.enum(['Pending', 'Paid', 'Overdue', 'Disputed']),
  poNumbers: z.array(z.string()).optional(),
});

// Shipment Log validation schema
export const shipmentLogSchema = z.object({
  shipmentId: z.string().min(1, "Shipment ID is required"),
  poNumber: z.string().min(1, "PO number is required"),
  carrier: z.string().min(1, "Carrier is required"),
  trackingNumber: z.string().optional(),
  receivedBy: z.string().min(1, "Received by is required"),
  status: z.enum(['In Transit', 'Delivered', 'Damaged', 'Lost']),
});

// Order Kit validation schema
export const orderKitSchema = z.object({
  templateName: z.string().min(1, "Template name is required"),
  description: z.string().optional(),
  category: z.string().min(1, "Category is required"),
  estimatedCost: z.number().positive("Estimated cost must be positive"),
  items: z.array(z.object({
    catalogItemId: z.string(),
    quantity: z.number().positive("Quantity must be positive"),
  })).min(1, "At least one item is required"),
});

// Validation functions
export const validateData = {
  project: (data: unknown) => projectSchema.parse(data),
  purchaseOrder: (data: unknown) => purchaseOrderSchema.parse(data),
  catalogItem: (data: unknown) => catalogItemSchema.parse(data),
  supplier: (data: unknown) => supplierSchema.parse(data),
  warehouse: (data: unknown) => warehouseSchema.parse(data),
  invoice: (data: unknown) => invoiceSchema.parse(data),
  shipmentLog: (data: unknown) => shipmentLogSchema.parse(data),
  orderKit: (data: unknown) => orderKitSchema.parse(data),
};

// Safe validation functions that return result objects
export const safeValidateData = {
  project: (data: unknown) => projectSchema.safeParse(data),
  purchaseOrder: (data: unknown) => purchaseOrderSchema.safeParse(data),
  catalogItem: (data: unknown) => catalogItemSchema.safeParse(data),
  supplier: (data: unknown) => supplierSchema.safeParse(data),
  warehouse: (data: unknown) => warehouseSchema.safeParse(data),
  invoice: (data: unknown) => invoiceSchema.safeParse(data),
  shipmentLog: (data: unknown) => shipmentLogSchema.safeParse(data),
  orderKit: (data: unknown) => orderKitSchema.safeParse(data),
};