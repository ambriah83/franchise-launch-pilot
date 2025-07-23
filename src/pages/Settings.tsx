import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Separator } from "@/components/ui/separator"
import { 
  Settings as SettingsIcon,
  User,
  Bell,
  Shield,
  Database,
  Download,
  Upload
} from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import { useState } from "react"

export default function Settings() {
  const { toast } = useToast()
  const [isLoading, setIsLoading] = useState(false)
  const [firstName, setFirstName] = useState("Sarah")
  const [lastName, setLastName] = useState("Chen")
  const [email, setEmail] = useState("sarah.chen@franchise.com")
  const [currentPassword, setCurrentPassword] = useState("")
  const [newPassword, setNewPassword] = useState("")

  const handleSaveProfile = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Profile Updated",
        description: "Your profile has been saved successfully.",
      })
    } catch (error) {
      toast({
        title: "Save Failed",
        description: "Failed to save profile changes.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      toast({
        title: "Missing Information",
        description: "Please enter both current and new passwords.",
        variant: "destructive",
      })
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      toast({
        title: "Password Changed",
        description: "Your password has been updated successfully.",
      })
      setCurrentPassword("")
      setNewPassword("")
    } catch (error) {
      toast({
        title: "Change Failed",
        description: "Failed to change password.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleTwoFactor = () => {
    toast({
      title: "Two-Factor Authentication",
      description: "2FA setup wizard would open here.",
    })
  }

  const handleSavePreferences = () => {
    toast({
      title: "Preferences Saved",
      description: "Your system preferences have been updated.",
    })
  }

  const handleExportData = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 2000))
      toast({
        title: "Data Exported",
        description: "Your data has been exported successfully.",
      })
    } catch (error) {
      toast({
        title: "Export Failed",
        description: "Failed to export data.",
        variant: "destructive",
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleImportData = () => {
    toast({
      title: "Import Data",
      description: "File selection dialog would open here.",
    })
  }

  const handleDeleteAccount = () => {
    toast({
      title: "Delete Account",
      description: "Account deletion confirmation would open here.",
      variant: "destructive",
    })
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">
            Configure system preferences and user settings
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Settings */}
        <div className="lg:col-span-2 space-y-6">
          {/* Profile Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Profile Settings
              </CardTitle>
              <CardDescription>
                Update your personal information and preferences
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input 
                    id="firstName" 
                    value={firstName} 
                    onChange={(e) => setFirstName(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input 
                    id="lastName" 
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="title">Job Title</Label>
                <Input id="title" defaultValue="Project Manager" />
              </div>
              
              <Button onClick={handleSaveProfile} disabled={isLoading}>
                {isLoading ? "Saving..." : "Save Profile"}
              </Button>
            </CardContent>
          </Card>

          {/* Notification Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5" />
                Notifications
              </CardTitle>
              <CardDescription>
                Choose what notifications you want to receive
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-base">Inventory Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Low stock and reorder notifications
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-base">Order Updates</div>
                    <div className="text-sm text-muted-foreground">
                      Purchase order status changes
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-base">Project Milestones</div>
                    <div className="text-sm text-muted-foreground">
                      Important project deadlines and updates
                    </div>
                  </div>
                  <Switch />
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <div className="text-base">Budget Alerts</div>
                    <div className="text-sm text-muted-foreground">
                      Budget threshold and variance notifications
                    </div>
                  </div>
                  <Switch defaultChecked />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Security Settings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5" />
                Security
              </CardTitle>
              <CardDescription>
                Manage your account security and access
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="currentPassword">Current Password</Label>
                  <Input 
                    id="currentPassword" 
                    type="password"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    placeholder="Enter current password"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="newPassword">New Password</Label>
                  <Input 
                    id="newPassword" 
                    type="password"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    placeholder="Enter new password"
                  />
                </div>
                <Button variant="outline" onClick={handleChangePassword} disabled={isLoading}>
                  {isLoading ? "Changing..." : "Change Password"}
                </Button>
              </div>
              <Button variant="outline" onClick={handleTwoFactor}>
                Enable Two-Factor Authentication
              </Button>
              <Separator />
              <div className="space-y-4">
                <h4 className="text-sm font-medium">Active Sessions</h4>
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-3 border rounded-lg">
                    <div>
                      <div className="text-sm font-medium">Current Session</div>
                      <div className="text-xs text-muted-foreground">Chrome on Windows • Atlanta, GA</div>
                    </div>
                    <div className="text-xs text-success">Active</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* System Settings */}
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <SettingsIcon className="h-5 w-5" />
                System Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label>Default Currency</Label>
                <Input defaultValue="USD" />
              </div>
              
              <div className="space-y-2">
                <Label>Time Zone</Label>
                <Input defaultValue="America/New_York" />
              </div>
              
              <div className="space-y-2">
                <Label>Date Format</Label>
                <Input defaultValue="MM/DD/YYYY" />
              </div>
              
              <Button className="w-full" onClick={handleSavePreferences}>
                Save Preferences
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5" />
                Data Management
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <Button 
                variant="outline" 
                className="w-full justify-start" 
                onClick={handleExportData}
                disabled={isLoading}
              >
                <Download className="h-4 w-4 mr-2" />
                {isLoading ? "Exporting..." : "Export Data"}
              </Button>
              
              <Button variant="outline" className="w-full justify-start" onClick={handleImportData}>
                <Upload className="h-4 w-4 mr-2" />
                Import Data
              </Button>
              
              <Separator />
              
              <Button variant="destructive" className="w-full" onClick={handleDeleteAccount}>
                Delete Account
              </Button>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>System Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Version:</span>
                <span>v1.1.0</span>
              </div>
              <div className="flex justify-between">
                <span>Last Updated:</span>
                <span>Jan 15, 2024</span>
              </div>
              <div className="flex justify-between">
                <span>License:</span>
                <span>Enterprise</span>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}