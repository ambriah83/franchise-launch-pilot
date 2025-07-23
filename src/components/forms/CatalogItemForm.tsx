import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from "@/components/ui/form"
import { CatalogItem } from "../../types"
import { localStorageService } from "../../services/localStorageService"
import { useToast } from "@/hooks/use-toast"
import { catalogItemSchema } from "@/schemas/validationSchemas"
import { useEffect, useState } from "react"

interface CatalogItemFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  item?: CatalogItem
  onSuccess: () => void
}

function CatalogItemForm({ open, onOpenChange, item, onSuccess }: CatalogItemFormProps) {
  const { toast } = useToast()
  const [isSubmitting, setIsSubmitting] = useState(false)

  const form = useForm({
    resolver: zodResolver(catalogItemSchema),
    defaultValues: {
      sku: item?.sku || "",
      itemName: item?.itemName || "",
      description: item?.description || "",
      category: item?.category || "",
      supplierId: item?.supplierId || "",
      defaultUnitPrice: item?.defaultUnitPrice || 0,
      status: item?.status || "Active" as "Active" | "Discontinued"
    }
  })

  // Reset form when item changes
  useEffect(() => {
    if (item) {
      form.reset({
        sku: item.sku,
        itemName: item.itemName,
        description: item.description,
        category: item.category,
        supplierId: item.supplierId,
        defaultUnitPrice: item.defaultUnitPrice,
        status: item.status
      })
    } else {
      form.reset({
        sku: "",
        itemName: "",
        description: "",
        category: "",
        supplierId: "",
        defaultUnitPrice: 0,
        status: "Active"
      })
    }
  }, [item, form])

  const suppliers = localStorageService.getSuppliers()
  const categories = [
    "Kitchen Equipment",
    "Furniture", 
    "Technology",
    "Fixtures",
    "Supplies",
    "Safety Equipment",
    "Other"
  ]

  const onSubmit = async (data: any) => {
    setIsSubmitting(true)

    try {
      const itemData = {
        sku: data.sku.trim().toUpperCase(),
        itemName: data.itemName.trim(),
        description: data.description.trim(),
        category: data.category,
        supplierId: data.supplierId,
        defaultUnitPrice: data.defaultUnitPrice,
        status: data.status
      }

      if (item) {
        localStorageService.updateCatalogItem(item.id, itemData)
        toast({
          title: "Item Updated",
          description: `${data.itemName} has been updated successfully.`
        })
      } else {
        localStorageService.createCatalogItem(itemData)
        toast({
          title: "Item Created",
          description: `${data.itemName} has been added to the catalog.`
        })
      }

      onSuccess()
      onOpenChange(false)
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save item. Please try again.",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      onOpenChange(false)
    }
    if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
      form.handleSubmit(onSubmit)()
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]" onKeyDown={handleKeyDown}>
        <DialogHeader>
          <DialogTitle>
            {item ? "Edit Catalog Item" : "Add New Catalog Item"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="sku"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>SKU *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., CHAIR-001"
                        {...field}
                        className={form.formState.errors.sku ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Discontinued">Discontinued</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="itemName"
                render={({ field }) => (
                  <FormItem className="md:col-span-2">
                    <FormLabel>Item Name *</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="e.g., Dining Chair - Standard"
                        {...field}
                        className={form.formState.errors.itemName ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="category"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Category *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={form.formState.errors.category ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map(category => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="supplierId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Supplier *</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger className={form.formState.errors.supplierId ? "border-destructive" : ""}>
                          <SelectValue placeholder="Select supplier" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {suppliers.map(supplier => (
                          <SelectItem key={supplier.id} value={supplier.id}>
                            {supplier.supplierName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="defaultUnitPrice"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Default Unit Price ($) *</FormLabel>
                    <FormControl>
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        placeholder="85.00"
                        {...field}
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        className={form.formState.errors.defaultUnitPrice ? "border-destructive" : ""}
                      />
                    </FormControl>
                    <FormDescription>
                      Standard price for this item
                    </FormDescription>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Detailed description of the item..."
                      rows={3}
                      {...field}
                    />
                  </FormControl>
                  <FormDescription>
                    Optional detailed description of the catalog item
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => onOpenChange(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting}>
                {isSubmitting ? "Saving..." : (item ? "Update Item" : "Add Item")}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

// Named and default exports for compatibility
export { CatalogItemForm }
export default CatalogItemForm