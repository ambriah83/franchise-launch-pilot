import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Layout } from "./components/Layout";
import Dashboard from "./pages/Dashboard";
import Projects from "./pages/Projects";
import PurchaseOrders from "./pages/PurchaseOrders";
import CreatePurchaseOrder from "./pages/CreatePurchaseOrder";
import OrderTemplates from "./pages/OrderTemplates";
import Inventory from "./pages/Inventory";
import InventoryCatalog from "./pages/InventoryCatalog";
import InventoryAlerts from "./pages/InventoryAlerts";
import Receiving from "./pages/Receiving";
import Invoices from "./pages/Invoices";
import Suppliers from "./pages/Suppliers";
import Warehouses from "./pages/Warehouses";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/projects" element={<Projects />} />
            <Route path="/purchase-orders" element={<PurchaseOrders />} />
            <Route path="/purchase-orders/create" element={<CreatePurchaseOrder />} />
            <Route path="/purchase-orders/templates" element={<OrderTemplates />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/inventory/catalog" element={<InventoryCatalog />} />
            <Route path="/inventory/alerts" element={<InventoryAlerts />} />
            <Route path="/receiving" element={<Receiving />} />
            <Route path="/invoices" element={<Invoices />} />
            <Route path="/suppliers" element={<Suppliers />} />
            <Route path="/warehouses" element={<Warehouses />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Layout>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;