import { useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { EisenhowerMatrix } from './components/eisenhower-matrix';
import { KanbanBoard } from './components/kanban-board';
import { Button } from '@/components/ui/button';
import {
  TaskFormDialog,
  type TaskFormValues,
} from './components/task-form-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { addTask } from './lib/db';

function App() {
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  const [viewMode, setViewMode] = useState<string>("eisenhower");

  const handleAddTask = async (values: TaskFormValues) => {
    await addTask({
      ...values,
      dueDate: new Date(values.dueDate),
    });
    setIsAddingTask(false);
    setRefreshTrigger((prev) => prev + 1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto py-6 px-4">
        <div className="w-full max-w-6xl mx-auto">
          <div className="w-full">
            <div className="mb-6 flex justify-between items-center">
              <div className="flex-grow-0">
                <Select value={viewMode} onValueChange={setViewMode}>
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Select view" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="eisenhower">Eisenhower Matrix</SelectItem>
                    <SelectItem value="kanban">Kanban Board</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex-grow"></div>
              <Button onClick={() => setIsAddingTask(true)}>Add Task</Button>
            </div>

            <div className="mt-6">
              {viewMode === "eisenhower" ? (
                <EisenhowerMatrix refreshTrigger={refreshTrigger} />
              ) : (
                <KanbanBoard refreshTrigger={refreshTrigger} />
              )}
            </div>
          </div>

          <Dialog open={isAddingTask} onOpenChange={setIsAddingTask}>
            <DialogContent aria-describedby={undefined}>
              <DialogHeader>
                <DialogTitle>Add New Task</DialogTitle>
              </DialogHeader>
              <TaskFormDialog
                isOpen={isAddingTask}
                onOpenChange={setIsAddingTask}
                onSubmit={handleAddTask}
                submitLabel="Add Task"
              />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </div>
  );
}

export { App };
