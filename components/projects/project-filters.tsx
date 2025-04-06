import { X } from 'lucide-react'
import type { ProjectStatusCategory } from "@/types/index"
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select"
import { DatePickerWithRange } from "@/components/ui/date-range-picker"
import { Button } from "@/components/ui/button"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { DateRange } from "react-day-picker"

interface ProjectFiltersProps {
  statusFilter: ProjectStatusCategory | 'all'
  onStatusChange: (status: ProjectStatusCategory | 'all') => void
  dateRange: DateRange | undefined
  onDateRangeChange: (range: DateRange | undefined) => void
  dateField: 'startDate' | 'endDate'
  onDateFieldChange: (field: 'startDate' | 'endDate') => void
}

export function ProjectFilters({ 
  statusFilter, 
  onStatusChange,
  dateRange,
  onDateRangeChange,
  dateField,
  onDateFieldChange
}: ProjectFiltersProps) {
  return (
    <div className="bg-muted/40 rounded-lg p-4 space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="font-medium">Filters</h3>
        <Button 
          variant="ghost" 
          size="sm" 
          className="h-8 px-2 text-muted-foreground"
          onClick={() => {
            onStatusChange('all')
            onDateRangeChange(undefined)
          }}
        >
          <X className="h-4 w-4 mr-1" />
          Clear filters
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <div className="space-y-2">
          <label className="text-sm font-medium">Status</label>
          <Select value={statusFilter} onValueChange={(value) => onStatusChange(value as ProjectStatusCategory | 'all')}>
            <SelectTrigger>
              <SelectValue placeholder="Select status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="new">New</SelectItem>
              <SelectItem value="in progress">In Progress</SelectItem>
              <SelectItem value="paused">Paused</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <label className="text-sm font-medium">Date Range</label>
          <div className="space-y-2">
            <RadioGroup 
              defaultValue={dateField} 
              value={dateField}
              onValueChange={(value) => onDateFieldChange(value as 'startDate' | 'endDate')}
              className="flex space-x-4"
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="startDate" id="startDate" />
                <Label htmlFor="startDate">Start Date</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="endDate" id="endDate" />
                <Label htmlFor="endDate">End Date</Label>
              </div>
            </RadioGroup>
            <DatePickerWithRange 
              date={dateRange} 
              setDate={onDateRangeChange} 
              placeholder={`Filter by ${dateField === 'startDate' ? 'start' : 'end'} date`}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
