import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CheckCircle, AlertCircle, Keyboard, Zap, Shield, Sparkles } from "lucide-react"
import OrderTemplateForm from "@/components/forms/OrderTemplateForm"
import { ProjectForm } from "@/components/forms/ProjectForm"
import InvoiceForm from "@/components/forms/InvoiceForm"
import CatalogItemForm from "@/components/forms/CatalogItemForm"
import ShipmentForm from "@/components/forms/ShipmentForm"
import { LoadingState } from "@/components/common/LoadingState"
import { ErrorBoundary } from "@/components/common/ErrorBoundary"
import { useKeyboardShortcuts } from "@/hooks/useKeyboardShortcuts"
import { useOptimisticUpdates } from "@/hooks/useOptimisticUpdates"

export function FormEnhancementsDemo() {
  const [activeForm, setActiveForm] = useState<string | null>(null)
  const [showLoading, setShowLoading] = useState(false)
  const [optimisticCounter, setOptimisticCounter] = useState(0)

  const { executeOptimistic } = useOptimisticUpdates<number>()

  // Demo keyboard shortcuts
  useKeyboardShortcuts([
    {
      key: "n",
      ctrlKey: true,
      action: () => setActiveForm("template"),
      description: "Ctrl+N - New Template"
    },
    {
      key: "p",
      ctrlKey: true,
      action: () => setActiveForm("project"),
      description: "Ctrl+P - New Project"
    },
    {
      key: "i",
      ctrlKey: true,
      action: () => setActiveForm("invoice"),
      description: "Ctrl+I - New Invoice"
    },
    {
      key: "l",
      ctrlKey: true,
      action: () => setShowLoading(!showLoading),
      description: "Ctrl+L - Toggle Loading Demo"
    }
  ])

  const handleOptimisticDemo = async () => {
    const newValue = optimisticCounter + 1
    await executeOptimistic(
      newValue,
      () => new Promise(resolve => setTimeout(() => resolve(newValue), 2000)),
      {
        successMessage: "Optimistic update completed!",
        onSuccess: (result) => setOptimisticCounter(result as number)
      }
    )
  }

  const features = [
    {
      icon: <Shield className="h-5 w-5" />,
      title: "Real-time Validation",
      description: "Instant feedback with Zod schema validation",
      status: "active"
    },
    {
      icon: <Keyboard className="h-5 w-5" />,
      title: "Keyboard Navigation",
      description: "Full keyboard support with shortcuts",
      status: "active"
    },
    {
      icon: <Zap className="h-5 w-5" />,
      title: "Optimistic Updates",
      description: "Instant UI feedback for better UX",
      status: "active"
    },
    {
      icon: <Sparkles className="h-5 w-5" />,
      title: "Enhanced Loading States",
      description: "Skeleton loaders and progress indicators",
      status: "active"
    }
  ]

  const formDemos = [
    {
      id: "template",
      name: "Order Template",
      description: "Create franchise setup templates",
      component: OrderTemplateForm
    },
    {
      id: "project",
      name: "Project",
      description: "Manage franchise locations",
      component: ProjectForm
    },
    {
      id: "invoice",
      name: "Invoice",
      description: "Process supplier invoices",
      component: InvoiceForm
    },
    {
      id: "catalog",
      name: "Catalog Item",
      description: "Add inventory items",
      component: CatalogItemForm
    },
    {
      id: "shipment",
      name: "Shipment",
      description: "Log incoming shipments",
      component: ShipmentForm
    }
  ]

  return (
    <div className="space-y-6">
      <div className="text-center space-y-2">
        <h1 className="text-3xl font-bold">Phase 4: Form Validation & UX Enhancement</h1>
        <p className="text-muted-foreground">
          Experience the enhanced forms with real-time validation, keyboard shortcuts, and optimistic updates
        </p>
      </div>

      <Tabs defaultValue="features" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="features">Features</TabsTrigger>
          <TabsTrigger value="forms">Forms Demo</TabsTrigger>
          <TabsTrigger value="loading">Loading States</TabsTrigger>
          <TabsTrigger value="shortcuts">Keyboard Shortcuts</TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <Card key={index}>
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {feature.icon}
                      <Badge variant="outline" className="text-xs">
                        {feature.status}
                      </Badge>
                    </div>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                  </div>
                </CardHeader>
                <CardContent>
                  <h3 className="font-semibold">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">
                    {feature.description}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Optimistic Updates Demo</CardTitle>
              <CardDescription>
                Click the button to see optimistic UI updates in action
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center space-x-4">
                <Button onClick={handleOptimisticDemo}>
                  Optimistic Counter: {optimisticCounter}
                </Button>
                <p className="text-sm text-muted-foreground">
                  The UI updates immediately, then confirms after 2 seconds
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="forms" className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {formDemos.map((demo) => (
              <Card key={demo.id} className="cursor-pointer hover:shadow-md transition-shadow">
                <CardHeader>
                  <CardTitle className="text-lg">{demo.name}</CardTitle>
                  <CardDescription>{demo.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <Button
                    onClick={() => setActiveForm(demo.id)}
                    className="w-full"
                  >
                    Open {demo.name} Form
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Form Enhancements</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm">
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Real-time validation with instant feedback</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Enhanced error messages and field descriptions</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Keyboard shortcuts (Escape to close, Ctrl+Enter to submit)</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Optimistic updates with loading states</span>
                </li>
                <li className="flex items-center space-x-2">
                  <CheckCircle className="h-4 w-4 text-green-500" />
                  <span>Form persistence (auto-save drafts)</span>
                </li>
              </ul>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="loading" className="space-y-4">
          <div className="flex items-center space-x-4 mb-4">
            <Button onClick={() => setShowLoading(!showLoading)}>
              {showLoading ? "Hide" : "Show"} Loading States
            </Button>
            <p className="text-sm text-muted-foreground">
              Toggle to see different loading state patterns
            </p>
          </div>

          {showLoading && (
            <ErrorBoundary>
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Table Loading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoadingState type="table" rows={5} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Cards Loading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoadingState type="cards" rows={6} />
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Form Loading</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <LoadingState type="form" rows={4} />
                  </CardContent>
                </Card>
              </div>
            </ErrorBoundary>
          )}
        </TabsContent>

        <TabsContent value="shortcuts" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Available Keyboard Shortcuts</CardTitle>
              <CardDescription>
                Use these shortcuts to navigate and interact with forms quickly
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-3 md:grid-cols-2">
                <div className="space-y-2">
                  <h4 className="font-semibold">Form Shortcuts</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Escape</span>
                      <span className="text-muted-foreground">Close dialog</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ctrl+Enter</span>
                      <span className="text-muted-foreground">Submit form</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Tab</span>
                      <span className="text-muted-foreground">Navigate fields</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <h4 className="font-semibold">Demo Shortcuts</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Ctrl+N</span>
                      <span className="text-muted-foreground">New Template</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ctrl+P</span>
                      <span className="text-muted-foreground">New Project</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ctrl+I</span>
                      <span className="text-muted-foreground">New Invoice</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Ctrl+L</span>
                      <span className="text-muted-foreground">Toggle Loading</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Form Dialogs */}
      <OrderTemplateForm
        open={activeForm === "template"}
        onOpenChange={(open) => !open && setActiveForm(null)}
        onSuccess={() => setActiveForm(null)}
      />

      <ProjectForm
        open={activeForm === "project"}
        onOpenChange={(open) => !open && setActiveForm(null)}
        onSuccess={() => setActiveForm(null)}
      />

      <InvoiceForm
        open={activeForm === "invoice"}
        onOpenChange={(open) => !open && setActiveForm(null)}
        onSuccess={() => setActiveForm(null)}
      />

      <CatalogItemForm
        open={activeForm === "catalog"}
        onOpenChange={(open) => !open && setActiveForm(null)}
        onSuccess={() => setActiveForm(null)}
      />

      <ShipmentForm
        open={activeForm === "shipment"}
        onOpenChange={(open) => !open && setActiveForm(null)}
        onSuccess={() => setActiveForm(null)}
      />
    </div>
  )
}