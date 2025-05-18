import { TaskFormDialog } from './task-form-dialog';
import { TaskStatus, type TaskEntity } from '@/lib/types';
import { useTask } from '@/lib/db';
// import type { CreateTaskDto } from '@/lib/types';

interface TaskProps {
  task: TaskEntity;
}

function TaskCard({ task }: TaskProps) {
  const { data } = useTask(task.id, {
    initialData: task,
  });

  if (!data) return <div>Loading...</div>;

  return (
    <>
      <TaskFormDialog task={data}>
        <div className="p-4 border rounded-lg shadow-sm bg-white cursor-pointer hover:bg-gray-50 transition-colors">
          <div className="flex-1">
            <h3
              className={`text-lg font-medium ${
                data.status === TaskStatus.DONE
                  ? 'line-through text-gray-500'
                  : ''
              }`}
            >
              {data.title}
            </h3>
            <p className="text-gray-600 mt-1">{data.description}</p>
            <div className="mt-2 flex items-center gap-4 text-sm text-gray-500">
              <span>Priority: {data.priority}</span>
              <span>Due: {new Date(data.dueDate).toLocaleDateString()}</span>
              <span>Status: {data.status}</span>
            </div>
          </div>
        </div>
      </TaskFormDialog>
    </>
  );
}

export { TaskCard };
