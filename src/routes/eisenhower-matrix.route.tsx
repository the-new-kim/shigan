import { useMemo, useState } from 'react';
import { TaskCard } from '@/components/task-card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { XIcon } from 'lucide-react';
import type { TaskEntity } from '@/lib/types';
import { TaskStatus } from '@/lib/types';
import { useGetAllTasks } from '@/lib/db';

function EisenhowerMatrixRoute() {
  const [statusFilters, setStatusFilters] = useState<Set<TaskStatus>>(
    new Set(Object.values(TaskStatus)),
  );
  const [daysThreshold, setDaysThreshold] = useState<number>(3);

  const { data } = useGetAllTasks();

  const tasks = useMemo(() => {
    const now = new Date();
    const thresholdDate = new Date();
    thresholdDate.setDate(now.getDate() + daysThreshold);

    const filteredTasks = data?.filter((task) =>
      statusFilters.has(task.status),
    );

    return {
      q1: filteredTasks?.filter(
        (task) => task.priority >= 7 && new Date(task.dueDate) <= thresholdDate,
      ), // Urgent & Important
      q2: filteredTasks?.filter(
        (task) => task.priority >= 7 && new Date(task.dueDate) > thresholdDate,
      ), // Not Urgent & Important
      q3: filteredTasks?.filter(
        (task) => task.priority < 7 && new Date(task.dueDate) <= thresholdDate,
      ), // Urgent & Not Important
      q4: filteredTasks?.filter(
        (task) => task.priority < 7 && new Date(task.dueDate) > thresholdDate,
      ), // Not Urgent & Not Important
    };
  }, [data, daysThreshold, statusFilters]);

  const [customDays, setCustomDays] = useState<number | null>(null);

  const handleDaysChange = (value: string) => {
    if (value === 'custom') {
      setCustomDays(daysThreshold);
    } else {
      setDaysThreshold(parseInt(value));
    }
  };

  const [isInputFocused, setIsInputFocused] = useState(false);

  const handleCustomDaysChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.replace(/[^0-9]/g, '');
    const numValue = parseInt(value) || 0;
    setCustomDays(numValue);
    setDaysThreshold(numValue);
  };

  const handleBlur = () => {
    setIsInputFocused(false);
  };

  const handleFocus = () => {
    setIsInputFocused(true);
  };

  const handleStatusFilterChange = (status: TaskStatus, checked: boolean) => {
    setStatusFilters((prev) => {
      const newFilters = new Set(prev);
      if (checked) {
        newFilters.add(status);
      } else {
        newFilters.delete(status);
      }
      return newFilters;
    });
  };

  const Quadrant = ({
    title,
    tasks,
  }: {
    title: string;
    tasks: TaskEntity[];
  }) => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-start items-center gap-2">
            <Label>Mark as urgent if due within</Label>
            {customDays !== null ? (
              <div className="relative">
                <Input
                  type="text"
                  value={
                    isInputFocused
                      ? customDays.toString()
                      : customDays === 0
                        ? 'Today'
                        : `${customDays} days`
                  }
                  onChange={handleCustomDaysChange}
                  onBlur={handleBlur}
                  onFocus={handleFocus}
                  className="h-9 w-[180px] pr-3 text-left"
                  placeholder="Enter days"
                  autoFocus
                />

                <button
                  type="button"
                  onClick={() => {
                    setCustomDays(null);
                    setDaysThreshold(3);
                  }}
                  className="absolute right-3.5 top-0 h-full flex justify-end items-center text-muted-foreground"
                >
                  <XIcon className="size-3.5" />
                </button>
              </div>
            ) : (
              <Select
                value={daysThreshold.toString()}
                onValueChange={handleDaysChange}
              >
                <SelectTrigger className="w-[180px]">
                  <SelectValue>
                    {daysThreshold === 0 ? 'Today' : `${daysThreshold} days`}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="0">Today</SelectItem>
                  <SelectItem value="3">3 days</SelectItem>
                  <SelectItem value="7">7 days</SelectItem>
                  <SelectItem value="30">30 days</SelectItem>
                  <SelectItem value="custom">Custom</SelectItem>
                </SelectContent>
              </Select>
            )}
          </div>
        </div>
        <div className="flex items-center gap-4">
          {Object.values(TaskStatus).map((status) => (
            <div key={status} className="flex items-center space-x-2">
              <Checkbox
                id={`status-${status}`}
                checked={statusFilters.has(status)}
                onCheckedChange={(checked: boolean) =>
                  handleStatusFilterChange(status, checked)
                }
              />
              <Label htmlFor={`status-${status}`}>{status}</Label>
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <Quadrant title="Urgent & Important" tasks={tasks?.q1 || []} />
        <Quadrant title="Not Urgent & Important" tasks={tasks?.q2 || []} />
        <Quadrant title="Urgent & Not Important" tasks={tasks?.q3 || []} />
        <Quadrant title="Not Urgent & Not Important" tasks={tasks?.q4 || []} />
      </div>
    </div>
  );
}

export { EisenhowerMatrixRoute };
