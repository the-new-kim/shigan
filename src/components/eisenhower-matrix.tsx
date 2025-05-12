import { useCallback, useEffect, useState } from 'react';
import type { Task } from '../lib/db';
import { TaskStatus } from '../lib/db';
import { getTasksByQuadrant, updateTask, deleteTask } from '../lib/db';
import { Task as TaskComponent } from './task';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Input } from '@/components/ui/input';

interface EisenhowerMatrixProps {
  refreshTrigger?: number;
}

function EisenhowerMatrix({ refreshTrigger = 0 }: EisenhowerMatrixProps) {
  const [tasks, setTasks] = useState<{
    q1: Task[];
    q2: Task[];
    q3: Task[];
    q4: Task[];
  }>({ q1: [], q2: [], q3: [], q4: [] });
  const [statusFilters, setStatusFilters] = useState<Set<TaskStatus>>(
    new Set(Object.values(TaskStatus)),
  );
  const [daysThreshold, setDaysThreshold] = useState(0);

  const loadTasks = useCallback(async () => {
    const tasksByQuadrant = await getTasksByQuadrant(daysThreshold);
    setTasks(tasksByQuadrant);
  }, [daysThreshold]);

  useEffect(() => {
    loadTasks();
  }, [loadTasks, refreshTrigger]);

  const handleUpdateTask = async (task: Task) => {
    await updateTask(task);
    loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    loadTasks();
  };

  const filterTasks = (tasks: Task[]) => {
    if (statusFilters.size === 0) return tasks;
    return tasks.filter((task) => statusFilters.has(task.status));
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

  const Quadrant = ({ title, tasks }: { title: string; tasks: Task[] }) => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {filterTasks(tasks).map((task) => (
          <TaskComponent
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="space-y-4 p-4 bg-gray-50 rounded-lg">
        <div className="space-y-2">
          <div className="flex justify-between items-center">
            <Label htmlFor="days-threshold">
              Due Date Threshold: {daysThreshold === 0 ? 'Today' : `Within ${daysThreshold} days`}
            </Label>
            <div className="w-20">
              <Input
                type="number"
                min="0"
                max="30"
                value={daysThreshold}
                onChange={(e) => setDaysThreshold(Math.max(0, Math.min(30, Number(e.target.value) || 0)))}
                className="h-8 text-center"
              />
            </div>
          </div>
          <Slider
            id="days-threshold"
            min={0}
            max={30}
            step={1}
            value={[daysThreshold]}
            onValueChange={([value]) => setDaysThreshold(value)}
            className="w-full"
          />
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
        <Quadrant title="Urgent & Important" tasks={tasks.q1} />
        <Quadrant title="Not Urgent & Important" tasks={tasks.q2} />
        <Quadrant title="Urgent & Not Important" tasks={tasks.q3} />
        <Quadrant title="Not Urgent & Not Important" tasks={tasks.q4} />
      </div>
    </div>
  );
}

export { EisenhowerMatrix };
