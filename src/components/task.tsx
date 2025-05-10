import { useState } from 'react';
import type { Task as TaskType } from '../lib/db';
import { TaskStatus } from '../lib/db';
import { TaskForm, type TaskFormValues } from './task-form';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

interface TaskProps {
  task: TaskType;
  onUpdate: (task: TaskType) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function Task({ task, onUpdate, onDelete }: TaskProps) {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleSave = async (values: TaskFormValues) => {
    await onUpdate({
      ...task,
      ...values,
      dueDate: new Date(values.dueDate),
    });
    setIsModalOpen(false);
  };

  const handleDelete = async () => {
    await onDelete(task.id);
    setIsModalOpen(false);
  };

  return (
    <>
      <div
        className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors"
        onClick={() => setIsModalOpen(true)}
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

      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent aria-describedby={undefined}>
          <DialogHeader>
            <DialogTitle>Edit Task</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={task}
            onSubmit={handleSave}
            onCancel={() => setIsModalOpen(false)}
            onDelete={handleDelete}
          />
        </DialogContent>
      </Dialog>
    </>
  );
}

export { Task };
