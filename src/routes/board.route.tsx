import type { DragEvent } from 'react';

import { TaskCard } from '@/components/task-card';
import { useGetAllTasks, useUpdateTask } from '@/lib/db';
import { TaskStatus } from '@/lib/types';

function BoardRoute() {
  const { data: tasks } = useGetAllTasks();

  const { mutateAsync: updateTask } = useUpdateTask();

  const handleDragStart = (e: DragEvent<HTMLDivElement>, taskId: string) => {
    e.dataTransfer.setData('taskId', taskId);
  };

  const handleDragOver = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleDrop = async (
    e: DragEvent<HTMLDivElement>,
    status: TaskStatus,
  ) => {
    e.preventDefault();
    const taskId = e.dataTransfer.getData('taskId');
    const task = tasks?.find((t) => t.id === taskId);

    if (task && task.status !== status) {
      await updateTask({
        ...task,
        status,
      });
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks?.filter((task) => task.status === status);
  };

  const Column = ({ status, title }: { status: TaskStatus; title: string }) => (
    <div
      className="flex-1 p-4 border rounded-lg bg-gray-50 min-h-[70vh]"
      onDragOver={handleDragOver}
      onDrop={(e) => handleDrop(e, status)}
    >
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">{title}</h2>
        <div className="bg-gray-200 rounded-full px-3 py-1 text-sm">
          {getTasksByStatus(status)?.length || 0}
        </div>
      </div>
      <div className="space-y-4">
        {getTasksByStatus(status)?.map((task) => (
          <div
            key={task.id}
            draggable
            onDragStart={(e) => handleDragStart(e, task.id)}
            className="cursor-move"
          >
            <TaskCard task={task} />
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div className="inline-flex gap-4">
      <Column status={TaskStatus.TODO} title="To Do" />
      <Column status={TaskStatus.IN_PROGRESS} title="In Progress" />
      <Column status={TaskStatus.DONE} title="Done" />
    </div>
  );
}

export { BoardRoute };
