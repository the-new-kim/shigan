import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
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
import { Button } from '@/components/ui/button';
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
  DialogTrigger,
  DialogClose,
  DialogDescription,
  // DialogDescription,
} from '@/components/ui/dialog';
import type { CreateTaskDto, TaskEntity } from '@/lib/types';
import { createTaskSchema, TaskStatus } from '@/lib/types';
import { useAddTask, useDeleteTask, useUpdateTask } from '@/lib/db';
import { useQueryClient } from '@tanstack/react-query';
import { useState } from 'react';

interface TaskFormDialogProps {
  task?: TaskEntity;
  children: React.ReactNode;
}

function TaskFormDialog({ task, children }: TaskFormDialogProps) {
  const [open, setOpen] = useState(false);

  const form = useForm<CreateTaskDto>({
    resolver: zodResolver(createTaskSchema),
    defaultValues: {
      title: task?.title ?? '',
      description: task?.description ?? '',
      priority: task?.priority ?? 5,
      dueDate: task?.dueDate ?? new Date().toISOString().split('T')[0],
      status: task?.status ?? TaskStatus.TODO,
    },
  });

  const queryClient = useQueryClient();

  const { mutateAsync: updateTask } = useUpdateTask();
  const { mutateAsync: addTask } = useAddTask();

  const handleSubmit = async (values: CreateTaskDto) => {
    if (task) {
      await updateTask({
        ...task,
        ...values,
      });
      queryClient.invalidateQueries({
        queryKey: ['task', task.id],
      });
    } else {
      await addTask(values);
      queryClient.invalidateQueries({
        queryKey: ['tasks'],
      });
    }
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent aria-describedby={undefined}>
        <DialogHeader>
          <DialogTitle>{task ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(handleSubmit)}
            className="space-y-4"
          >
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
            <DialogFooter>
              <div className="flex justify-between w-full">
                <div>
                  {task && (
                    <DeleteTaskDialog task={task} onOpenChange={setOpen}>
                      <Button type="button" variant="destructive">
                        Delete
                      </Button>
                    </DeleteTaskDialog>
                  )}
                </div>
                <div className="flex gap-2">
                  <Button type="submit">{task ? 'Save' : 'Add'}</Button>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancel
                    </Button>
                  </DialogClose>
                </div>
              </div>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

interface DeleteTaskDialogProps {
  task: TaskEntity;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

function DeleteTaskDialog({
  task,
  onOpenChange,
  children,
}: DeleteTaskDialogProps) {
  const [open, setOpen] = useState(false);
  const queryClient = useQueryClient();
  const { mutateAsync: deleteTask } = useDeleteTask();

  const handleDelete = async () => {
    await deleteTask(task.id);
    queryClient.invalidateQueries({
      queryKey: ['tasks'],
    });
    setOpen(false);
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Delete Task</DialogTitle>
          <DialogDescription>
            Are you sure you want to delete "{task.title}"? This action cannot
            be undone.
          </DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={handleDelete}>
            Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export { TaskFormDialog };
