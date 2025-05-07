import type { DBSchema, IDBPDatabase } from 'idb';
import { openDB } from 'idb';

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: Date;
  priority: number; // 0-10
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

interface TaskDB extends DBSchema {
  tasks: {
    key: string;
    value: Task;
    indexes: {
      'by-dueDate': Date;
      'by-priority': number;
      'by-completed': number;
    };
  };
}

let db: IDBPDatabase<TaskDB> | null = null;

export const initDB = async () => {
  if (db) return db;

  db = await openDB<TaskDB>('task-manager', 1, {
    upgrade(database) {
      const store = database.createObjectStore('tasks', { keyPath: 'id' });
      store.createIndex('by-dueDate', 'dueDate');
      store.createIndex('by-priority', 'priority');
      store.createIndex('by-completed', 'completed');
    },
  });

  return db;
};

export const getDB = async () => {
  if (!db) {
    await initDB();
  }
  return db!;
};

export const addTask = async (
  task: Omit<Task, 'id' | 'createdAt' | 'updatedAt'>,
) => {
  const db = await getDB();
  const id = crypto.randomUUID();
  const now = new Date();

  return db.add('tasks', {
    ...task,
    id,
    createdAt: now,
    updatedAt: now,
  });
};

export const updateTask = async (task: Task) => {
  const db = await getDB();
  return db.put('tasks', {
    ...task,
    updatedAt: new Date(),
  });
};

export const deleteTask = async (id: string) => {
  const db = await getDB();
  return db.delete('tasks', id);
};

export const getAllTasks = async () => {
  const db = await getDB();
  return db.getAll('tasks');
};

export const getTasksByQuadrant = async () => {
  const tasks = await getAllTasks();
  const now = new Date();

  return {
    q1: tasks.filter(
      (task) => !task.completed && task.priority >= 7 && task.dueDate <= now,
    ), // Urgent & Important
    q2: tasks.filter(
      (task) => !task.completed && task.priority >= 7 && task.dueDate > now,
    ), // Not Urgent & Important
    q3: tasks.filter(
      (task) => !task.completed && task.priority < 7 && task.dueDate <= now,
    ), // Urgent & Not Important
    q4: tasks.filter(
      (task) => !task.completed && task.priority < 7 && task.dueDate > now,
    ), // Not Urgent & Not Important
  };
};
