import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import type { Task as TaskType } from '../lib/db';
import { TaskStatus } from '../lib/db';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Slider } from '@/components/ui/slider';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  priority: z.number().min(0).max(10),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.nativeEnum(TaskStatus),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskProps {
  task: TaskType;
  onUpdate: (task: TaskType) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

function Task({ task, onUpdate, onDelete }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);

  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues: {
      title: task.title,
      description: task.description,
      priority: task.priority,
      dueDate: task.dueDate.toISOString().split('T')[0],
      status: task.status,
    },
  });

  const handleSave = async (values: TaskFormValues) => {
    await onUpdate({
      ...task,
      ...values,
      dueDate: new Date(values.dueDate),
    });
    setIsEditing(false);
  };

  const handleStatusChange = async (status: TaskStatus) => {
    await onUpdate({
      ...task,
      status,
    });
  };

  if (isEditing) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSave)} className="space-y-4">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Task title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Task description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="priority"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Priority: {field.value}</FormLabel>
                  <FormControl>
                    <Slider
                      min={0}
                      max={10}
                      step={1}
                      value={[field.value]}
                      onValueChange={([value]) => field.onChange(value)}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dueDate"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Due Date</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="status"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <Select
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      <SelectItem value={TaskStatus.TODO}>TODO</SelectItem>
                      <SelectItem value={TaskStatus.IN_PROGRESS}>
                        IN_PROGRESS
                      </SelectItem>
                      <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="ghost"
                onClick={() => setIsEditing(false)}
              >
                Cancel
              </Button>
              <Button type="submit">Save</Button>
            </div>
          </form>
        </Form>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between">
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
          </div>
        </div>
        <div className="flex gap-2">
          <Select
            onValueChange={(value: TaskStatus) => handleStatusChange(value)}
            defaultValue={task.status}
          >
            <SelectTrigger className="w-[100px]">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value={TaskStatus.TODO}>TODO</SelectItem>
              <SelectItem value={TaskStatus.IN_PROGRESS}>
                IN_PROGRESS
              </SelectItem>
              <SelectItem value={TaskStatus.DONE}>DONE</SelectItem>
            </SelectContent>
          </Select>
          <Button variant="ghost" onClick={() => setIsEditing(true)}>
            Edit
          </Button>
          <Button variant="destructive" onClick={() => onDelete(task.id)}>
            Delete
          </Button>
        </div>
      </div>
    </div>
  );
}

export { Task };
