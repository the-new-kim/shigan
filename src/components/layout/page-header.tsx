import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Filter, ArrowUpDown } from 'lucide-react';

interface PageHeaderProps {
  viewMode: string;
  onViewModeChange: (value: string) => void;
  onAddTask: () => void;
}

export function PageHeader({
  viewMode,
  onViewModeChange,
  onAddTask,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      <div className="flex items-center justify-between gap-4">
        <div className="w-48">
          <Select value={viewMode} onValueChange={onViewModeChange}>
            <SelectTrigger>
              <SelectValue placeholder="Select view" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="eisenhower">Eisenhower Matrix</SelectItem>
              <SelectItem value="kanban">Kanban Board</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="flex justify-end items-center gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <Filter className="h-4 w-4" />
                <span>Filter</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              {/* Filter options will go here */}
              <div className="p-2 text-sm text-muted-foreground">
                Filter options coming soon
              </div>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="gap-2">
                <ArrowUpDown className="h-4 w-4" />
                <span>Sort</span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-40" align="start">
              {/* Sort options will go here */}
              <div className="p-2 text-sm text-muted-foreground">
                Sort options coming soon
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
          <Button onClick={onAddTask} size="sm">
            Add Task
          </Button>
        </div>
      </div>
    </header>
  );
}
