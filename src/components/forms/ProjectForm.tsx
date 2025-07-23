import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { CalendarIcon } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Project, ProjectStatus } from '../../types';
import { localStorageService } from '../../services/localStorageService';
import { useToast } from '@/hooks/use-toast';

interface ProjectFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project?: Project;
  onSuccess: () => void;
}

export function ProjectForm({ open, onOpenChange, project, onSuccess }: ProjectFormProps) {
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    locationName: project?.locationName || '',
    status: project?.status || 'Planning' as ProjectStatus,
    targetOpeningDate: project?.targetOpeningDate || new Date(),
    totalBudget: project?.totalBudget || 0,
    notes: ''
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      // Validation
      if (!formData.locationName.trim()) {
        toast({
          title: "Validation Error",
          description: "Location name is required",
          variant: "destructive"
        });
        return;
      }

      if (formData.totalBudget <= 0) {
        toast({
          title: "Validation Error", 
          description: "Budget must be greater than 0",
          variant: "destructive"
        });
        return;
      }

      const projectData = {
        locationName: formData.locationName.trim(),
        projectManagerId: '1', // Default to Sarah Chen
        status: formData.status,
        targetOpeningDate: formData.targetOpeningDate,
        totalBudget: formData.totalBudget,
        totalCommitted: project?.totalCommitted || 0,
        totalSpent: project?.totalSpent || 0,
        budgetVariance: project?.budgetVariance || formData.totalBudget
      };

      if (project) {
        // Update existing project
        localStorageService.updateProject(project.id, projectData);
        toast({
          title: "Project Updated",
          description: `${formData.locationName} has been updated successfully.`
        });
      } else {
        // Create new project
        localStorageService.createProject(projectData);
        toast({
          title: "Project Created",
          description: `${formData.locationName} has been added to your projects.`
        });
      }

      onSuccess();
      onOpenChange(false);

      // Reset form
      setFormData({
        locationName: '',
        status: 'Planning',
        targetOpeningDate: new Date(),
        totalBudget: 0,
        notes: ''
      });

    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to save project. Please try again.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>
            {project ? 'Edit Project' : 'Create New Project'}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="locationName">Location Name *</Label>
              <Input
                id="locationName"
                value={formData.locationName}
                onChange={(e) => setFormData(prev => ({ ...prev, locationName: e.target.value }))}
                placeholder="e.g., Queen Creek, Mesa East"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status</Label>
              <Select 
                value={formData.status} 
                onValueChange={(value: ProjectStatus) => setFormData(prev => ({ ...prev, status: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Planning">Planning</SelectItem>
                  <SelectItem value="In Progress">In Progress</SelectItem>
                  <SelectItem value="On Hold">On Hold</SelectItem>
                  <SelectItem value="Completed">Completed</SelectItem>
                  <SelectItem value="Cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Target Opening Date *</Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.targetOpeningDate && "text-muted-foreground"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.targetOpeningDate ? format(formData.targetOpeningDate, "PPP") : "Pick a date"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.targetOpeningDate}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, targetOpeningDate: date }))}
                    disabled={(date) => date < new Date()}
                    initialFocus
                    className="pointer-events-auto"
                  />
                </PopoverContent>
              </Popover>
            </div>

            <div className="space-y-2">
              <Label htmlFor="totalBudget">Total Budget ($) *</Label>
              <Input
                id="totalBudget"
                type="number"
                min="0"
                step="1000"
                value={formData.totalBudget}
                onChange={(e) => setFormData(prev => ({ ...prev, totalBudget: Number(e.target.value) }))}
                placeholder="250000"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="notes">Notes</Label>
            <Textarea
              id="notes"
              value={formData.notes}
              onChange={(e) => setFormData(prev => ({ ...prev, notes: e.target.value }))}
              placeholder="Additional project details, requirements, or notes..."
              rows={3}
            />
          </div>

          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => onOpenChange(false)}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Saving...' : (project ? 'Update Project' : 'Create Project')}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}