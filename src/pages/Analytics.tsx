import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { 
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Package,
  Clock,
  FileText
} from "lucide-react"

export default function Analytics() {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground">
            Insights and performance metrics across all franchise operations
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline">
            <FileText className="h-4 w-4 mr-2" />
            Generate Report
          </Button>
          <Button>
            <BarChart3 className="h-4 w-4 mr-2" />
            Custom Dashboard
          </Button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Revenue</CardTitle>
            <DollarSign className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(2450000)}</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              +12.3% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Procurement Spend</CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{formatCurrency(1850000)}</div>
            <p className="text-xs text-destructive flex items-center">
              <TrendingDown className="h-3 w-3 mr-1" />
              -4.2% from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Lead Time</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">12.5 days</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Improved by 2.1 days
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Budget Efficiency</CardTitle>
            <BarChart3 className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">94.2%</div>
            <p className="text-xs text-success flex items-center">
              <TrendingUp className="h-3 w-3 mr-1" />
              Above target (90%)
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Spending Trends */}
        <Card>
          <CardHeader>
            <CardTitle>Monthly Spending Trends</CardTitle>
            <CardDescription>Procurement spend over the last 12 months</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chart placeholder</p>
                <p className="text-sm">Monthly spending visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Project Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Project Performance</CardTitle>
            <CardDescription>Budget vs actual spending by project</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-64 flex items-center justify-center border-2 border-dashed border-muted rounded-lg">
              <div className="text-center text-muted-foreground">
                <BarChart3 className="h-12 w-12 mx-auto mb-4 opacity-50" />
                <p>Chart placeholder</p>
                <p className="text-sm">Project performance visualization would appear here</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Performance Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Supplier Performance</CardTitle>
            <CardDescription>Top performing suppliers by delivery time</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { name: "Kitchen Solutions LLC", score: 98, leadTime: "8 days" },
              { name: "Restaurant Depot Inc.", score: 95, leadTime: "10 days" },
              { name: "Commercial Furniture Co.", score: 92, leadTime: "14 days" }
            ].map((supplier, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{supplier.name}</div>
                  <div className="text-sm text-muted-foreground">Avg: {supplier.leadTime}</div>
                </div>
                <div className="text-right">
                  <div className="font-bold text-success">{supplier.score}%</div>
                  <div className="text-xs text-muted-foreground">Score</div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Budget Utilization</CardTitle>
            <CardDescription>Budget usage across active projects</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { project: "Downtown Chicago", used: 85, budget: 500000 },
              { project: "Westside Atlanta", used: 72, budget: 450000 },
              { project: "Brooklyn Heights", used: 91, budget: 380000 }
            ].map((project, index) => (
              <div key={index} className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>{project.project}</span>
                  <span>{project.used}%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full ${
                      project.used >= 90 ? 'bg-destructive' :
                      project.used >= 80 ? 'bg-warning' : 'bg-success'
                    }`}
                    style={{ width: `${project.used}%` }}
                  />
                </div>
                <div className="text-xs text-muted-foreground">
                  {formatCurrency((project.budget * project.used) / 100)} of {formatCurrency(project.budget)}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Inventory Turnover</CardTitle>
            <CardDescription>Stock movement by category</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {[
              { category: "Kitchen Equipment", turnover: 4.2, trend: "up" },
              { category: "Furniture", turnover: 3.8, trend: "up" },
              { category: "Technology", turnover: 6.1, trend: "down" },
              { category: "Supplies", turnover: 12.4, trend: "up" }
            ].map((item, index) => (
              <div key={index} className="flex items-center justify-between">
                <div>
                  <div className="font-medium">{item.category}</div>
                  <div className="text-sm text-muted-foreground">
                    {item.turnover}x per year
                  </div>
                </div>
                <div className={`text-sm ${item.trend === 'up' ? 'text-success' : 'text-destructive'}`}>
                  {item.trend === 'up' ? <TrendingUp className="h-4 w-4" /> : <TrendingDown className="h-4 w-4" />}
                </div>
              </div>
            ))}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}