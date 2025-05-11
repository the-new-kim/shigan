import { useState } from 'react';
import type { Task as TaskType } from '../lib/db';
import { TaskStatus } from '../lib/db';
import { TaskFormDialog, type TaskFormValues } from './task-form-dialog';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';

interface TaskProps {
  task: TaskType;
  onUpdate: (task: TaskType) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function Task({ task, onUpdate, onDelete }: TaskProps) {
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);

  const handleSave = async (values: TaskFormValues) => {
    await onUpdate({
      ...task,
      ...values,
      dueDate: new Date(values.dueDate),
    });
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    setIsDeleteDialogOpen(false);
    setIsEditDialogOpen(false);
  };

  return (
    <>
      <div
        className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsEditDialogOpen(true)}
      >
        <div className="flex-1">
          <h3
            className={`text-lg font-medium ${
              task.status === TaskStatus.DONE
                ? 'line-through text-gray-500'
                : ''
            }`}
          >
            {task.title}
          </h3>
          <p className="text-gray-600 mt-1">{task.description}</p>
          <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
            <span>Priority: {task.priority}</span>
            <span>Due: {task.dueDate.toLocaleDateString()}</span>
            <span>Status: {task.status}</span>
          </div>
        </div>
      </div>

      <TaskFormDialog
        task={task}
        isOpen={isEditDialogOpen}
        onOpenChange={setIsEditDialogOpen}
        onSubmit={handleSave}
        onDelete={() => setIsDeleteDialogOpen(true)}
      />

      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Task</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete "{task.title}"? This action cannot
              be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setIsDeleteDialogOpen(false)}
            >
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDelete}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export { Task };
