import { useEffect, useState } from 'react';
import type { Task } from '../lib/db';
import { TaskStatus } from '../lib/db';
import { getTasksByQuadrant, addTask, updateTask, deleteTask } from '../lib/db';
import { Task as TaskComponent } from './task';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

function EisenhowerMatrix() {
  const [tasks, setTasks] = useState<{
    q1: Task[];
    q2: Task[];
    q3: Task[];
    q4: Task[];
  }>({ q1: [], q2: [], q3: [], q4: [] });
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [statusFilters, setStatusFilters] = useState<Set<TaskStatus>>(
    new Set(Object.values(TaskStatus)),
  );
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    priority: 5,
    dueDate: new Date().toISOString().split('T')[0],
    status: TaskStatus.TODO,
  });

  const loadTasks = async () => {
    const tasksByQuadrant = await getTasksByQuadrant();
    setTasks(tasksByQuadrant);
  };

  useEffect(() => {
    loadTasks();
  }, []);

  const handleAddTask = async () => {
    await addTask({
      ...newTask,
      dueDate: new Date(newTask.dueDate),
    });
    setNewTask({
      title: '',
      description: '',
      priority: 5,
      dueDate: new Date().toISOString().split('T')[0],
      status: TaskStatus.TODO,
    });
    setIsAddingTask(false);
    loadTasks();
  };

  const handleUpdateTask = async (task: Task) => {
    await updateTask(task);
    loadTasks();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTask(id);
    loadTasks();
  };

  const filterTasks = (tasks: Task[]) => {
    if (statusFilters.size === 0) return tasks;
    return tasks.filter((task) => statusFilters.has(task.status));
  };

  const handleStatusFilterChange = (status: TaskStatus, checked: boolean) => {
    setStatusFilters((prev) => {
      const newFilters = new Set(prev);
      if (checked) {
        newFilters.add(status);
      } else {
        newFilters.delete(status);
      }
      return newFilters;
    });
  };

  const Quadrant = ({ title, tasks }: { title: string; tasks: Task[] }) => (
    <div className="p-4 border rounded-lg bg-gray-50">
      <h2 className="text-lg font-semibold mb-4">{title}</h2>
      <div className="space-y-4">
        {filterTasks(tasks).map((task) => (
          <TaskComponent
            key={task.id}
            task={task}
            onUpdate={handleUpdateTask}
            onDelete={handleDeleteTask}
          />
        ))}
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      <div className="mb-6 flex justify-between items-center">
        <h1 className="text-2xl font-bold">Eisenhower Matrix</h1>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-4">
            {Object.values(TaskStatus).map((status) => (
              <div key={status} className="flex items-center space-x-2">
                <Checkbox
                  id={`status-${status}`}
                  checked={statusFilters.has(status)}
                  onCheckedChange={(checked: boolean) =>
                    handleStatusFilterChange(status, checked)
                  }
                />
                <Label htmlFor={`status-${status}`}>{status}</Label>
              </div>
            ))}
          </div>
          <button
            onClick={() => setIsAddingTask(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Add Task
          </button>
        </div>
      </div>

      {isAddingTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-xl font-semibold mb-4">Add New Task</h2>
            <input
              type="text"
              value={newTask.title}
              onChange={(e) =>
                setNewTask({ ...newTask, title: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
              placeholder="Task title"
            />
            <textarea
              value={newTask.description}
              onChange={(e) =>
                setNewTask({ ...newTask, description: e.target.value })
              }
              className="w-full mb-2 p-2 border rounded"
              placeholder="Task description"
            />
            <div className="mb-2">
              <label className="block text-sm font-medium text-gray-700">
                Priority
              </label>
              <input
                type="range"
                min="0"
                max="10"
                value={newTask.priority}
                onChange={(e) =>
                  setNewTask({ ...newTask, priority: Number(e.target.value) })
                }
                className="w-full"
              />
              <span className="text-sm text-gray-500">{newTask.priority}</span>
            </div>
            <input
              type="date"
              value={newTask.dueDate}
              onChange={(e) =>
                setNewTask({ ...newTask, dueDate: e.target.value })
              }
              className="w-full mb-4 p-2 border rounded"
            />
            <div className="flex justify-end gap-2">
              <button
                onClick={() => setIsAddingTask(false)}
                className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTask}
                className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Add Task
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4">
        <Quadrant title="Urgent & Important" tasks={tasks.q1} />
        <Quadrant title="Not Urgent & Important" tasks={tasks.q2} />
        <Quadrant title="Urgent & Not Important" tasks={tasks.q3} />
        <Quadrant title="Not Urgent & Not Important" tasks={tasks.q4} />
      </div>
    </div>
  );
}

export { EisenhowerMatrix };
