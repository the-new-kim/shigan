import { z } from 'zod';

const entitySchema = z.object({
  id: z.string(),
  createdAt: z.string(),
  updatedAt: z.string(),
});

enum TaskStatus {
  TODO = 'TODO',
  IN_PROGRESS = 'IN_PROGRESS',
  DONE = 'DONE',
}

const createTaskSchema = z.object({
  title: z.string().min(1, 'Title is required'),
  description: z.string(),
  priority: z.number().min(0).max(10),
  dueDate: z.string().min(1, 'Due date is required'),
  status: z.nativeEnum(TaskStatus),
});

const updateTaskSchema = entitySchema.merge(createTaskSchema.partial());
const taskEntitySchema = entitySchema.merge(createTaskSchema);

type CreateTaskDto = z.infer<typeof createTaskSchema>;
type UpdateTaskDto = z.infer<typeof updateTaskSchema>;
type TaskEntity = z.infer<typeof taskEntitySchema>;

export type { CreateTaskDto, UpdateTaskDto, TaskEntity };
export { createTaskSchema, updateTaskSchema, taskEntitySchema, TaskStatus };
