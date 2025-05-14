import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { EisenhowerMatrix } from '@/components/eisenhower-matrix';
import { KanbanBoard } from '@/components/kanban-board';
import { PageHeader } from '@/components/layout/page-header';
import { TaskFormDialog, type TaskFormValues } from '@/components/task-form-dialog';
import { addTask } from '@/lib/db';

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
            <PageHeader 
              viewMode={viewMode}
              onViewModeChange={setViewMode}
              onAddTask={() => setIsAddingTask(true)}
            />

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
