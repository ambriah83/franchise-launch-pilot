import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { 
  Building2, 
  Calendar,
  DollarSign,
  User,
  Plus,
  FileText,
  MoreHorizontal
} from "lucide-react"
import { mockProjects, getUserById } from "@/data/mockData"
import { useToast } from "@/hooks/use-toast"
import { useNavigate } from "react-router-dom"
import { useState } from "react"

export default function Projects() {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [isLoading, setIsLoading] = useState(false)

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'completed': return 'bg-success'
      case 'in progress': return 'bg-primary'
      case 'planning': return 'bg-warning'
      case 'on hold': return 'bg-muted'
      default: return 'bg-muted'
    }
  }

  const getProgressValue = (project: any) => {
    const spent = project.totalSpent || 0
    const budget = project.totalBudget || 1
    return (spent / budget) * 100
  }

  const handleExportReport = async () => {
    setIsLoading(true)
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Report Generated",
        description: "Projects report has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed", 
        description: "Failed to generate projects report.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleNewProject = () => {
    toast({
      title: "New Project",
      description: "Redirecting to project creation...",
    })
    // Navigate to project creation page (would be implemented)
    setTimeout(() => {
      toast({
        title: "Feature Coming Soon",
        description: "Project creation workflow will be available soon.",
      })
    }, 1000)
  }

  const handleViewDetails = (projectId: string) => {
    toast({
      title: "Project Details",
      description: `Loading details for project ${projectId}...`,
    })
  }

  const handleManageProject = (projectId: string) => {
    toast({
      title: "Project Management",
      description: `Opening management dashboard for project ${projectId}...`,
    })
  }

  const handleMoreOptions = (projectId: string) => {
    toast({
      title: "Project Options",
      description: "More options menu would open here.",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Projects</h1>
          <p className="text-muted-foreground">
            Manage all franchise location projects
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={handleExportReport} disabled={isLoading}>
            <FileText className="h-4 w-4 mr-2" />
            {isLoading ? "Exporting..." : "Export Report"}
          </Button>
          <Button onClick={handleNewProject}>
            <Plus className="h-4 w-4 mr-2" />
            New Project
          </Button>
        </div>
      </div>

      {/* Project Cards Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {mockProjects.map((project) => {
          const manager = getUserById(project.projectManagerId)
          const progressValue = getProgressValue(project)
          
          return (
            <Card key={project.id} className="hover:shadow-md transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <CardTitle className="text-lg">{project.locationName}</CardTitle>
                    <CardDescription className="flex items-center gap-2">
                      <Building2 className="h-4 w-4" />
                      Franchise Location
                    </CardDescription>
                  </div>
                  <Button variant="ghost" size="sm" onClick={() => handleMoreOptions(project.id)}>
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </div>
                <Badge className={getStatusColor(project.status)}>
                  {project.status}
                </Badge>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Project Manager */}
                <div className="flex items-center gap-2">
                  <User className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">PM: {manager?.name}</span>
                </div>
                
                {/* Target Date */}
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">Target: {project.targetOpeningDate.toLocaleDateString()}</span>
                </div>
                
                {/* Budget Info */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Budget Progress</span>
                    <span className="text-sm text-muted-foreground">
                      {formatCurrency(project.totalSpent || 0)} / {formatCurrency(project.totalBudget)}
                    </span>
                  </div>
                  <Progress value={progressValue} className="h-2" />
                  <div className="flex items-center justify-between text-xs text-muted-foreground">
                    <span>{progressValue.toFixed(1)}% used</span>
                    <span>{formatCurrency((project.totalBudget - (project.totalSpent || 0)))} remaining</span>
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <Button variant="outline" size="sm" className="flex-1" onClick={() => handleViewDetails(project.id)}>
                    View Details
                  </Button>
                  <Button size="sm" className="flex-1" onClick={() => handleManageProject(project.id)}>
                    Manage
                  </Button>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}