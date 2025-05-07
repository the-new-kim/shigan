import { useState } from 'react';
import type { Task as TaskType } from '../lib/db';

interface TaskProps {
  task: TaskType;
  onUpdate: (task: TaskType) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function Task({ task, onUpdate, onDelete }: TaskProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [title, setTitle] = useState(task.title);
  const [description, setDescription] = useState(task.description);
  const [priority, setPriority] = useState(task.priority);
  const [dueDate, setDueDate] = useState(
    task.dueDate.toISOString().split('T')[0],
  );

  const handleSave = async () => {
    await onUpdate({
      ...task,
      title,
      description,
      priority,
      dueDate: new Date(dueDate),
    });
    setIsEditing(false);
  };

  const handleComplete = async () => {
    await onUpdate({
      ...task,
      completed: !task.completed,
    });
  };

  if (isEditing) {
    return (
      <div className="p-4 border rounded-lg shadow-sm bg-white">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
          placeholder="Task title"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
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
            value={priority}
            onChange={(e) => setPriority(Number(e.target.value))}
            className="w-full"
          />
          <span className="text-sm text-gray-500">{priority}</span>
        </div>
        <input
          type="date"
          value={dueDate}
          onChange={(e) => setDueDate(e.target.value)}
          className="w-full mb-2 p-2 border rounded"
        />
        <div className="flex justify-end gap-2">
          <button
            onClick={() => setIsEditing(false)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-3 py-1 text-sm bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Save
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 border rounded-lg shadow-sm bg-white">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3
            className={`text-lg font-medium ${task.completed ? 'line-through text-gray-500' : ''}`}
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
          <button
            onClick={handleComplete}
            className={`px-3 py-1 text-sm rounded ${
              task.completed
                ? 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                : 'bg-green-500 text-white hover:bg-green-600'
            }`}
          >
            {task.completed ? 'Undo' : 'Complete'}
          </button>
          <button
            onClick={() => setIsEditing(true)}
            className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="px-3 py-1 text-sm text-red-600 hover:text-red-800"
          >
            Delete
          </button>
        </div>
      </div>
    </div>
  );
}
