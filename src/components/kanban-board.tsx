import type { DragEvent } from 'react';
import { useEffect, useState } from 'react';
import type { Task } from '../lib/db';
import { TaskStatus } from '../lib/db';
import { getAllTasks, updateTask, deleteTask } from '../lib/db';
import { Task as TaskComponent } from './task';

interface KanbanBoardProps {
  refreshTrigger?: number;
}

function KanbanBoard({ refreshTrigger = 0 }: KanbanBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);

  const [isLoading, setIsLoading] = useState(true);

  const loadTasks = async () => {
    setIsLoading(true);
    try {
      const allTasks = await getAllTasks();
      setTasks(allTasks);
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadTasks();
  }, [refreshTrigger]);

  const handleUpdateTask = async (task: Task) => {
    await updateTask(task);
    loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    loadTasks();
  };

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
    const task = tasks.find((t) => t.id === taskId);

    if (task && task.status !== status) {
      await updateTask({
        ...task,
        status,
        updatedAt: new Date(),
      });
      loadTasks();
    }
  };

  const getTasksByStatus = (status: TaskStatus) => {
    return tasks.filter((task) => task.status === status);
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
          {getTasksByStatus(status).length}
        </div>
      </div>
      <div className="space-y-4">
        {isLoading ? (
          <div className="text-center py-4">Loading tasks...</div>
        ) : (
          getTasksByStatus(status).map((task) => (
            <div
              key={task.id}
              draggable
              onDragStart={(e) => handleDragStart(e, task.id)}
              className="cursor-move"
            >
              <TaskComponent
                task={task}
                onUpdate={handleUpdateTask}
                onDelete={handleDeleteTask}
              />
            </div>
          ))
        )}
      </div>
    </div>
  );

  return (
    <div className="flex gap-4">
      <Column status={TaskStatus.TODO} title="To Do" />
      <Column status={TaskStatus.IN_PROGRESS} title="In Progress" />
      <Column status={TaskStatus.DONE} title="Done" />
    </div>
  );
}

export { KanbanBoard };
